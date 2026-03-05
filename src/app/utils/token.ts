import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envConfig } from "../../config/envConfig";
import { Response } from "express";
import ms from 'ms'
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(payload, envConfig.ACCESS_TOKEN_SECRET as string,
        { expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN } as SignOptions
    )
    return token;
}
const getRefreshToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(payload, envConfig.REFRESH_TOKEN_SECRET as string,
        { expiresIn: envConfig.REFRESH_TOKEN_EXPIRE_IN } as SignOptions
    )
    return token;
};


const setAccessTokenCookie = (res: Response, token: string) => {
    const maxAge = ms('1d');
    cookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        maxAge: maxAge
    })
}
const setRefreshTokenCookie = (res: Response, token: string) => {
    const maxAge = ms('7d');
    cookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        maxAge:maxAge
    })
}
const setBetterAuthTokenCookie = (res: Response, token: string) => {
    const maxAge = ms('1d');
    cookieUtils.setCookie(res, 'better-auth.session_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        maxAge:maxAge
    })
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthTokenCookie
}