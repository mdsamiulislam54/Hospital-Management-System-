import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await authService.createUser(payload);
    const { accessToken, refreshToken, token, ...rest } = data;
    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBetterAuthTokenCookie(res, token as string)
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "User created successfully",
        data: {
            token,
            ...rest,
            accessToken,
            refreshToken
        }
    })
});

const signIn = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await authService.signIn(payload);
    const { accessToken, refreshToken, token, ...rest } = data;
    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBetterAuthTokenCookie(res, token)
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "User signed in successfully",
        data: {
            token,
            ...rest,
            accessToken,
            refreshToken,

        }
    })
});

const signOut = catchAsync(async (req: Request, res: Response) => {
    const headers = req.headers as Record<string, string>;
    const data = await authService.signOut(headers);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "User signed out successfully",
        data
    })
});
const getNewToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"]
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const data = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { newAccessToken, newRefreshToken, sessionToken } = data;
    tokenUtils.setAccessTokenCookie(res, newAccessToken)
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken)
    tokenUtils.setBetterAuthTokenCookie(res, sessionToken)
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "User signed out successfully",
        data
    })
});





export const authController = {
    createUser,
    signIn,
    signOut,
    getNewToken

}