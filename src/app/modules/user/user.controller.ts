import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { userService } from "./user.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await userService.createDoctor(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Doctor created successfully",
        data: data
    })
})
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const data = await userService.getAllUsers();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users retrieved successfully",
        data: data
    })
})

export const userController = {
    createDoctor,
    getAllUsers
   
}