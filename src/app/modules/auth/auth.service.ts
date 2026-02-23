import { User } from "../../../generated/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
const createUser = async (payload: User & { password: string }) => {
    const { name, email, password } = payload;
    const user = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    });

    const patient  = await prisma.$transaction(async(tx)=>{
        const patientTx = await tx.patient.create({
            data:{
                userId: user.user.id,
                name: user.user.name,
                email: user.user.email,
            }
        });

        return patientTx;
    })
    return {
        ...user,
        patient
    };
};
const signIn = async (payload: User & { password: string }) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if(data.user.status !== "ACTIVE"){
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