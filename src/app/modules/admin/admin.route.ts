import { Router } from "express";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";
import { adminController } from "./admin.controller";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { updateAdminZodSchema } from "./admin.validation";

const router = Router()

router.get('/', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getAllAdmin);
router.get('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getAdminById);

router.patch('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), zodValidationMiddleware(updateAdminZodSchema), adminController.updateAdmin);

router.patch('/delete/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.deleteAdmin);

export const adminRoute = router;