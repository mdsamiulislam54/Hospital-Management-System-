import dotenv from "dotenv";

import status from "http-status";
import { AppError } from "../app/middleware/AppError";

dotenv.config();

interface EnvConfig {
    DATABASE_URL: string;
    BACKEND_URL: string;
    FRONTEND_URL: string;
    PORT: string;
    NODE_ENV: string;
    BETTER_AUTH_URL?: string;
    BETTER_AUTH_SECRET: string;
    ACCESS_TOKEN_SECRET?: string;
    REFRESH_TOKEN_SECRET?: string;
    ACCESS_TOKEN_EXPIRE_IN?: string;
    REFRESH_TOKEN_EXPIRE_IN?: string;
    SENDER_EMAIL_APP_PASS: string;
    SENDER_EMAIL_APP_FORM: string;
    SENDER_EMAIL_APP_PORT: string;
    SENDER_EMAIL_APP_SMTP: string;
}



const loadEnvConfig: () => EnvConfig = () => {
    const requiredEnvVars = [
        'DATABASE_URL',
        'BACKEND_URL',
        'FRONTEND_URL',
        'PORT',
        'NODE_ENV',
        'BETTER_AUTH_URL',
        'BETTER_AUTH_SECRET',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'ACCESS_TOKEN_EXPIRE_IN',
        'REFRESH_TOKEN_EXPIRE_IN',
        'SENDER_EMAIL_APP_PASS',
        'SENDER_EMAIL_APP_FORM',
        'SENDER_EMAIL_APP_PORT',
        'SENDER_EMAIL_APP_SMTP',
    ];

    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new AppError(status.NOT_FOUND, `Environment variable ${varName} is required but not defined.`);
        }
    });
    return {
        DATABASE_URL: process.env.DATABASE_URL as string,
        BACKEND_URL: process.env.BACKEND_URL as string || "",
        FRONTEND_URL: process.env.FRONTEND_URL as string || "",
        PORT: process.env.PORT as string || "5000",
        NODE_ENV: process.env.NODE_ENV as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string || "",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN as string,
        REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN as string,
        SENDER_EMAIL_APP_PASS: process.env.SENDER_EMAIL_APP_PASS as string,
        SENDER_EMAIL_APP_FORM: process.env.SENDER_EMAIL_APP_FORM as string,
        SENDER_EMAIL_APP_PORT: process.env.SENDER_EMAIL_APP_PORT as string,
        SENDER_EMAIL_APP_SMTP: process.env.SENDER_EMAIL_APP_SMTP as string

    }
}

export const envConfig = loadEnvConfig();
