import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { doctorService } from "./doctor.service";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const data = await doctorService.getAllDoctors();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All doctors retrieved successfully",
        data: data
    })
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await doctorService.getDoctorById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: data
    })
});

const doctorUpdateById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    const data = await doctorService.doctorUpdateById(id as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor updated successfully",
        data: data

    })
});

const doctorDeleteById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);
    const data = await doctorService.doctorDeleteById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: data

    })
});
const doctorRestoreById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);
    const data = await doctorService.doctorRestoreById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor restored successfully",
        data: data

    })
});


export const doctorController = {
    getAllDoctors,
    getDoctorById,
    doctorUpdateById,
    doctorDeleteById,
    doctorRestoreById

}