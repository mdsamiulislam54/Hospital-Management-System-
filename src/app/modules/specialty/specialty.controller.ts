import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const data = await specialtyService.createSpecialty(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Specialty created successfully",
        data
    });
});

const getSpecialties = catchAsync(async (req: Request, res: Response) => {
    const data = await specialtyService.getSpecialties();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Specialties retrieved successfully",
        data
    });
});

const getSpecialtyById = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    const data = await specialtyService.getSpecialtyById(id as string);
    if (!data) {
        return res.status(404).json({ message: "Specialty not found", success: false });
    }
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Specialty retrieved successfully",
        data
    });

});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const data = await specialtyService.deleteSpecialty(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "Specialty deleted successfully",
        success: true,
        data
    });

});

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const payload = req.body;
    const data = await specialtyService.updateSpecialty(id as string, payload);
    sendResponse(res, {
        httpStatusCode: status.UPGRADE_REQUIRED,
        message: "Specialty updated successfully",
        success: true,
        data
    });

});





export const specialtyController = {
    createSpecialty,
    getSpecialties,
    getSpecialtyById,
    deleteSpecialty,
    updateSpecialty
}