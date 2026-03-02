import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { superAdminService } from "./superAdmin.service";


const getAllSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const data = await superAdminService.getAllSuperAdmin();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All Super Admin retrieved successfully",
        data: data
    })
});
const getSuperAdminById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await superAdminService.getSuperAdminById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: " Super Admin retrieved successfully",
        data: data
    })
});
const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id as string
    const data = await superAdminService.updateSuperAdmin(payload, id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super Admin update successfully",
        data: data
    })
});
const deleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await superAdminService.deleteSuperAdmin(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: " Super Admin delete successfully",
        data: data
    })
});


export const superAdminController = {
    getSuperAdminById,
    getAllSuperAdmin,
    updateSuperAdmin,
    deleteSuperAdmin
}