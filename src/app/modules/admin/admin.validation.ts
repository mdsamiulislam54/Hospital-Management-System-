import { z } from "zod";
import { Gender } from "../../../generated/enums";

export const updateAdminZodSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    email: z.string("Invalid email address").optional(),
    profilePhoto: z.string().nullable().optional(),
    contactNumber: z
        .string()
        .min(11, "Contact number too short")
        .max(14, "Contact number too long")
        .nullable()
        .optional(),
    gender: z.nativeEnum(Gender).nullable().optional(),
});