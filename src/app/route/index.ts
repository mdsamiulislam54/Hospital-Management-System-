import { Router } from "express";
import { specialtyRouter } from "../modules/specialty/specialty.router";

const router = Router();

router.use('/api/v1/specialty',specialtyRouter);
// router.use('api/v1/doctor');
// router.use('api/v1/patient');
// router.use('api/v1/appointment');
// router.use('api/v1/auth');

export const indexRouter = router; 