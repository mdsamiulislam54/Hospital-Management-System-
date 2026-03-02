import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Status, UserRole } from "../../generated/enums";
import { envConfig } from "../../config/envConfig";
import ms from "ms";

export const auth = betterAuth({

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),


  baseURL: envConfig.BACKEND_URL,

  trustedOrigins: ["http://localhost:3000","http://localhost:5000"],

  withCredentials: true,

  session: {
    expiresIn: ms('1d') / 1000,
    updateAge: ms('1d') / 1000,
    cookieCache: {
      enabled: true,
      maxAge: ms('1h')
    }
  },
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: Status.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

});