import { success } from "better-auth";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const  globalErrorHandler = (err: Error, req: Request, res: Response, _next:NextFunction) => {

    console.error("Global Error Handler:", err);
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = err.message || "An unexpected error occurred";

    res.status(statusCode).json({
        success: false,
        message: message,
    });

}