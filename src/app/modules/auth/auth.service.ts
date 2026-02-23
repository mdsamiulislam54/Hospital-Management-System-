import { User } from "../../../generated/client";
import { auth } from "../../lib/auth";
const createUser = async (payload: User & { password: string }) => {
    const { name, email, password } = payload;
    const user = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    });
    return user;
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