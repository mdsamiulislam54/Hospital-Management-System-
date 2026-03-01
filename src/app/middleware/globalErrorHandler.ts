
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { IErrorSource, zodError } from "./zodError";
import { envConfig } from "../../config/envConfig";

export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = err.message || "An unexpected error occurred";
    let errorSource: IErrorSource[] = [];

    if (err instanceof z.ZodError) {
        const zodErrorResult = zodError(err);
        statusCode = zodErrorResult.statusCode;
        message = zodErrorResult.message;
        errorSource = zodErrorResult.errorSource;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        errorSource,
        message: envConfig.NODE_ENV === 'development' ? message : undefined,

    });

}