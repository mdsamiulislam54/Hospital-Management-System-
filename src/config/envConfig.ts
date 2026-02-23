import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    DATABASE_URL: string;
    BACKEND_URL: string;
    FRONTEND_URL: string;
    PORT: string;
    NODE_ENV: string;
    BETTER_AUTH_URL?: string;
    BETTER_AUTH_SECRET: string;
}



const loadEnvConfig: () => EnvConfig = () => {
    const requiredEnvVars = [
        'DATABASE_URL',
        'BACKEND_URL',
        'FRONTEND_URL',
        'PORT',
        'NODE_ENV',
        'BETTER_AUTH_URL',
        'BETTER_AUTH_SECRET'
    ];

    requiredEnvVars.forEach((varName)=>{
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is required but not defined.`);
        }
    });
    return {
        DATABASE_URL: process.env.DATABASE_URL as string,
        BACKEND_URL: process.env.BACKEND_URL as string || "",
        FRONTEND_URL: process.env.FRONTEND_URL as string || "",
        PORT: process.env.PORT as string || "5000",
        NODE_ENV: process.env.NODE_ENV as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string || "",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string

    }
}

export const envConfig = loadEnvConfig();
