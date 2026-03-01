import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envConfig } from "../../config/envConfig";

const getAccessToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(payload, envConfig.ACCESS_TOKEN_SECRET as string,
        { expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN } as SignOptions
    )
    return token;
}
const getRefreshToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(payload, envConfig.ACCESS_TOKEN_SECRET as string,
        { expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN } as SignOptions
    )
    return token;
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken
}