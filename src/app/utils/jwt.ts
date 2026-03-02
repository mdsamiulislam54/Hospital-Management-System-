
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { success } from "zod";

const createToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
};

const verifyToken = (token: string, secret: string) => {
    try {
        const decode = jwt.verify(token, secret) as JwtPayload;
        return {
            success:true,
            data: decode
        }
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : undefined,
            error
        }
    }

};

const decode = (token:string)=>{
    const decode = jwt.decode(token) as JwtPayload;
    return decode
};


export const jwtUtils = {
    createToken,
    verifyToken,
    decode
}