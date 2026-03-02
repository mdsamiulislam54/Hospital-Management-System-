import z from "zod";
import { Gender } from "../../../generated/enums";

export const createDoctorZodSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    data: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email address"),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().min(11).max(14, '').optional(),
        registrationNumber: z.string(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string().optional(),
        experience: z.number(),
        qualification: z.string().optional(),
        appointmentFee: z.number(),
        gender: z.enum([Gender.FEMALE, Gender.MALE])
    }),
    specialties: z.array(z.uuid()).min(1, "At least one specialty is required")
});


export const createSuperAdminValidationSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    data: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email address"),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().min(11).max(14, '').optional(),
        gender: z.enum([Gender.FEMALE, Gender.MALE])
    }),

});
export const createAdminValidationSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    data: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email address"),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().min(11).max(14, '').optional(),
        gender: z.enum([Gender.FEMALE, Gender.MALE])
    }),

});



