import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Status, UserRole } from "../../generated/enums";
import { envConfig } from "../../config/envConfig";
import ms from "ms";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";


export const auth = betterAuth({

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: envConfig.BACKEND_URL,
  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],
  withCredentials: true,

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {

        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          })

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Email Verification OTP",
              templateName: 'otp',
              templateData: {
                otp,
                name: user.name
              }
            })
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6

    })
  ],

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
    requireEmailVerification: true
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