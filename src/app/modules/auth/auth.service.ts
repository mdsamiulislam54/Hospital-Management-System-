import { User } from "../../../generated/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
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
        throw new Error("User creation failed");
    }
    if (data.user.status !== "ACTIVE") {
        throw new Error("User is not active");
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
        return {
            ...data,
            patient
        };
    } catch (error) {
        console.error("Error creating patient record:", error);
        await prisma.user.delete({ where: { id: data.user.id } });
        throw new Error("Failed to create patient record", { cause: error });
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
        throw new Error("User is not active");
    }
    return data;
};
const signOut = async (headers: Record<string, string>) => {
    const user = await auth.api.signOut({
        headers
    })
    return user;
};


export const authService = {
    createUser,
    signIn,
    signOut
}