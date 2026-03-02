import { Router } from "express";
import { userController } from "./user.controller";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { createAdminValidationSchema, createDoctorZodSchema, createSuperAdminValidationSchema } from "./zodSchema";


const router = Router();

router.get('/', userController.getAllUsers)
router.post('/create-doctor', zodValidationMiddleware(createDoctorZodSchema), userController.createDoctor);
router.post('/create-super-admin', zodValidationMiddleware(createSuperAdminValidationSchema), userController.createSuperAdmin);
router.post('/create-admin', zodValidationMiddleware(createAdminValidationSchema), userController.createAdmin);


export const userRouter = router;