import { Router } from "express";
import { authController } from "./auth.controller";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";

const router = Router();

router.post('/register', authController.createUser)
router.post('/login', authController.signIn)
router.post('/logout', authController.signOut)
router.post('/refresh-token', authController.getNewToken)
router.post('/change-password', authVerify(UserRole.ADMIN, UserRole.PATIENT, UserRole.SUPER_ADMIN, UserRole.DOCTOR), authController.changePassword)


export const authRouter = router;