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

  session: {
    expiresIn: ms('1d') / 1000,
    updateAge: ms('1d') / 1000,
    cookieCache: {
      enabled: true,
      maxAge: ms('1h')
    }
  },
  baseURL: envConfig.BACKEND_URL,

  trustedOrigins: [
    envConfig.FRONTEND_URL,
    envConfig.BACKEND_URL
  ],

  withCredentials: true,
  cookies: {
    sessionToken: {
      name: "__Secure-better-auth.session_token",

      attributes: {
        httpOnly: true,
        secure: envConfig.NODE_ENV === "production",
        sameSite:
          envConfig.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      },
    },
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