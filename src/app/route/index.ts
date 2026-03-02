import { Router } from "express";
import { specialtyRouter } from "../modules/specialty/specialty.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.router";

const router = Router();

router.use('/api/v1/specialty', specialtyRouter);
router.use('/api/v1/doctor', doctorRouter);
// router.use('/api/v1/patient');
// router.use('/api/v1/appointment');
router.use('/api/v1/user', userRouter);
router.use('/api/v1/auth', authRouter);
// router.use('/api/v1/super-admin', authRouter);

export const indexRouter = router; 