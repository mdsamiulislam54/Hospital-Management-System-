/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "node:path"
import { envConfig } from "../../config/envConfig"
import { AppError } from "../middleware/AppError"
import status from "http-status"


interface ISendEmailData {
    to: string
    templateData: Record<string, any>
    templateName: string
    subject: string

}
const transporter = nodemailer.createTransport({
    host: envConfig.SENDER_EMAIL_APP_SMTP,
    port: Number(envConfig.SENDER_EMAIL_APP_PORT),
    auth: {
        user: envConfig.SENDER_EMAIL_APP_FORM,
        pass: envConfig.SENDER_EMAIL_APP_PASS
    }
});


export const sendEmail = async (payload: ISendEmailData) => {
    try {
        const { to, templateData, templateName, subject } = payload;
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`)

        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envConfig.SENDER_EMAIL_APP_FORM,
            to,
            subject,
            html
        });

        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.log(error)
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Email Send Failed")
    }

}