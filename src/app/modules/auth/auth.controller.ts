import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await authService.createUser(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "User created successfully",
        data
    })
});

const signIn = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await authService.signIn(payload);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "User signed in successfully",
        data
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





export const authController = {
    createUser,
    signIn,
    signOut

}