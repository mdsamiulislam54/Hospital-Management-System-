import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { adminService } from "./admin.service";
import status from "http-status";


const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.getAllAdmin();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All Admin retrieved successfully",
        data: data
    })
});
const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await adminService.getAdminById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: " Admin retrieved successfully",
        data: data
    })
});
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id as string
    const data = await adminService.updateAdmin(payload, id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin update successfully",
        data: data
    })
});
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await adminService.deleteAdmin(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin delete successfully",
        data: data
    })
});


export const adminController = {
    getAdminById,
    getAllAdmin,
    updateAdmin,
    deleteAdmin
}