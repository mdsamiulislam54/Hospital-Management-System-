import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";

const router = Router();
router.get('/',  doctorController.getAllDoctors);
router.get('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.getDoctorById);


router.patch('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.doctorUpdateById);
router.patch('/delete/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.doctorDeleteById);
router.patch('/restore/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.doctorRestoreById);

export const doctorRouter = router;