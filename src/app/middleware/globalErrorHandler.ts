
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { IErrorSource, zodError } from "./zodError";
import { envConfig } from "../../config/envConfig";
import status from "http-status";

export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = err.message || "An unexpected error occurred";
    let errorSource: IErrorSource[] = [];
    let stack = err.stack;

    if (err instanceof z.ZodError) {
        const zodErrorResult = zodError(err);
        statusCode = zodErrorResult.statusCode;
        message = zodErrorResult.message;
        errorSource = zodErrorResult.errorSource;
    } else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR
        message = err.message
        stack = err.stack
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        errorSource,
        message: envConfig.NODE_ENV === 'development' ? message : undefined,
        stack: envConfig.NODE_ENV === 'development' ? stack : undefined,

    });

}