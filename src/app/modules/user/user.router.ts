import { Router } from "express";
import { userController } from "./user.controller";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { createDoctorZodSchema } from "./doctorZodSchema";

const router = Router();

router.get('/', userController.getAllUsers)
router.post('/create-doctor', zodValidationMiddleware(createDoctorZodSchema), userController.createDoctor);


export const userRouter = router;