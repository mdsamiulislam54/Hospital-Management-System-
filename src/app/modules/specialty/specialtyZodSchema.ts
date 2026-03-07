import z from "zod";

export const specialtyZodSchema = z.object({
    title: z.string(),
    description: z.string().optional()
    
})