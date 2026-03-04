import { NextFunction, Request, Response } from "express";
import { Status, UserRole } from "../../generated/enums";
import { cookieUtils } from "../utils/cookie";
import { AppError } from "./AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envConfig } from "../../config/envConfig";
import { role } from "better-auth/plugins";

export function authVerify(...roles: UserRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const sessionToken = cookieUtils.getCookie(req, 'better-auth.session_token');
        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized , No valid session token provided')
        };

        if (sessionToken) {
            const sessionExists = await prisma.session.findUnique({
                where: { token: sessionToken },
                include: {
                    user: true
                }
            });

            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);
                const sessionLiftTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLiftTime) * 100;

                if (percentRemaining > 20) {
                    res.setHeader('X-Session-Refresh', "true");
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());

                    console.log("session Expires Soon!!")

                }

                if (user.status === Status.BLOCKED || user.status === Status.INACTIVE || user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized access! User is not active");
                }

                if (roles.length > 0 && !roles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, "Forbidden access! User is not authorized");
                }

                req.user = {
                    userId:user.id,
                    role:user.role,
                    email:user.email
                }

            }

            

        }

        const accessToken = cookieUtils.getCookie(req, 'accessToken');
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No access token Provided")
        };

        const verifyToken = jwtUtils.verifyToken(accessToken, envConfig.ACCESS_TOKEN_SECRET!);
        if (!verifyToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid access token")
        }

        if (roles.length > 0 && !roles.includes(verifyToken.data!.role as UserRole)) {
            throw new AppError(status.FORBIDDEN, "Forbidden access! User is not authorized");
        }

        
       

        next()


    }

}