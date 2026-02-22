import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.join(process.cwd(), "../../.env")});

export const envConfig = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    BACKEND_URL: process.env.BACKEND_URL || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
    PORT: process.env.PORT || "5000",


};