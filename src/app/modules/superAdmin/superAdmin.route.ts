import { Router } from "express";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { superAdminController } from "./superAdmin.controller";
import { updateAdminZodSchema } from "../admin/admin.validation";


const router = Router()

router.get('/', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), superAdminController.getAllSuperAdmin);
router.get('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), superAdminController.getSuperAdminById);

router.patch('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), zodValidationMiddleware(updateAdminZodSchema), superAdminController.updateSuperAdmin);

router.patch('/delete/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), superAdminController.deleteSuperAdmin);

export const superAdminRoute = router;