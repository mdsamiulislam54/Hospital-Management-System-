import status from "http-status";
import { User } from "../../../generated/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwt";
import { envConfig } from "../../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";
import { IEmailVerification, IRestPassword, IUserChangePassword } from "./auth.interface";

const createUser = async (payload: User & { password: string }) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    });
    if (!data.user) {
        throw new AppError(status.NOT_FOUND, "User creation failed");
    }
    if (data.user.status !== "ACTIVE") {
        throw new AppError(status.NOT_FOUND, "User is not active");
    }


    try {
        const patient = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                }
            });

            return patientTx;
        })

        const accessToken = tokenUtils.getAccessToken({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            emailVerify: data.user.emailVerified,
            status: data.user.status,
            isDeleted: data.user.isDeleted
        });
        const refreshToken = tokenUtils.getRefreshToken({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            emailVerify: data.user.emailVerified,
            status: data.user.status,
            isDeleted: data.user.isDeleted
        });


        return {
            ...data,
            patient,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Error creating patient record:", error);
        await prisma.user.delete({ where: { id: data.user.id } });
        throw new AppError(status.NOT_FOUND, "Failed to create patient record");
    }
};
const signIn = async (payload: User & { password: string }) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if (data.user.status !== "ACTIVE") {
        throw new AppError(status.NOT_FOUND, "User is not active");
    };

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        emailVerify: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        emailVerify: data.user.emailVerified,
        status: data.user.status,
        isDeleted: data.user.isDeleted
    });


    return {
        ...data,
        accessToken,
        refreshToken
    };
};
const signOut = async (sessionToken: string) => {
    const user = await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`

        })

    })
    return user;
};


const getNewToken = async (refreshToken: string, sessionToken: string) => {

    const isExistSessionToken = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: true
        }
    });


    if (!isExistSessionToken) {
        throw new AppError(status.UNAUTHORIZED, "User session token not valid");
    }
    const verifyToken = jwtUtils.verifyToken(refreshToken, envConfig.REFRESH_TOKEN_SECRET!);
    if (!verifyToken.success && verifyToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Refresh token is not valid")
    };
    const { data } = verifyToken as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        emailVerify: data.emailVerified,
        status: data.status,
        isDeleted: data.isDeleted
    });
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        emailVerify: data.emailVerified,
        status: data.status,
        isDeleted: data.isDeleted
    });

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    })

    return { newAccessToken, newRefreshToken, sessionToken: token }
}

const changePassword = async (payload: IUserChangePassword, sessionToken: string) => {
    const sessionUser = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: true
        }
    });

    if (!sessionUser) {
        throw new AppError(status.UNAUTHORIZED, "Session not found");
    };

    if (sessionUser.user.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: sessionUser.user.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }
    const updatePassword = await auth.api.changePassword({
        body: {
            currentPassword: payload.currentPassword,
            newPassword: payload.newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });

    const accessToken = tokenUtils.getAccessToken({
        userId: sessionUser.user.id,
        name: sessionUser.user.name,
        email: sessionUser.user.email,
        role: sessionUser.user.role,
        emailVerify: sessionUser.user.emailVerified,
        status: sessionUser.user.status,
        isDeleted: sessionUser.user.isDeleted
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: sessionUser.user.id,
        name: sessionUser.user.name,
        email: sessionUser.user.email,
        role: sessionUser.user.role,
        emailVerify: sessionUser.user.emailVerified,
        status: sessionUser.user.status,
        isDeleted: sessionUser.user.isDeleted
    });

    return {
        ...updatePassword,
        accessToken,
        refreshToken
    }
}

const emailVerification = async (payload: IEmailVerification) => {
    const { otp, email } = payload;
    const data = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    });
    if (data.status && !data.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        })
    }
};

const forgetPassword = async (email: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!isExistUser) {
        throw new AppError(status.BAD_REQUEST, 'User not found')
    }

    if (!isExistUser.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Your email not verified!")
    }
    if (isExistUser.status === "BLOCKED" || isExistUser.status === 'INACTIVE') {
        throw new AppError(status.BAD_REQUEST, "This user is deleted")
    }

    return await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })
}


const resetPass = async (payload: IRestPassword) => {
    const { email, otp, resetPassword } = payload;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError(status.BAD_REQUEST, "User not found");
    }

    if (!user.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Your email is not verified");
    }

    if (user.status === "BLOCKED" || user.status === "INACTIVE") {
        throw new AppError(status.BAD_REQUEST, "This user is not active");
    }

    await auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password: resetPassword
        }
    });

    await prisma.session.deleteMany({
        where: {
            userId: user.id
        }
    });

    return {
        message: "Password reset successful"
    };
};

export const authService = {
    createUser,
    signIn,
    signOut,
    getNewToken,
    changePassword,
    emailVerification,
    forgetPassword,
    resetPass
}