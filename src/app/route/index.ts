import { Router } from "express";
import { specialtyRouter } from "../modules/specialty/specialty.router";
import { authRouter } from "../modules/auth/auth.router";

const router = Router();

router.use('/api/v1/specialty', specialtyRouter);
// router.use('api/v1/doctor');
// router.use('api/v1/patient');
// router.use('api/v1/appointment');
router.use('/api/v1/auth', authRouter);

export const indexRouter = router; 