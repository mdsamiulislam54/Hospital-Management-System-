import status from "http-status";
import { User } from "../../../generated/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwt";
import { envConfig } from "../../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";
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
        accessToken,
        refreshToken
    };
};
const signOut = async (headers: Record<string, string>) => {
    const user = await auth.api.signOut({
        headers
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


export const authService = {
    createUser,
    signIn,
    signOut,
    getNewToken
}