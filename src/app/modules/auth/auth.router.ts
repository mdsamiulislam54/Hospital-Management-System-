import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/register', authController.createUser)
router.post('/login', authController.signIn)
router.post('/logout', authController.signOut)


export const authRouter = router;