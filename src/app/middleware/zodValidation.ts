import { NextFunction, Request, Response } from "express";
import z from "zod";

export const zodValidationMiddleware = (schema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validatedData = schema.safeParse(req.body);
        if (!validatedData.success) {
            next(validatedData.error)
        }
        req.body = validatedData.data;

        next();

    };
};