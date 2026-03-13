import { Router } from "express";
import { specialtyRouter } from "../modules/specialty/specialty.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.router";
import { adminRoute } from "../modules/admin/admin.route";
import { superAdminRoute } from "../modules/superAdmin/superAdmin.route";
import { scheduleRoutes } from "../modules/schedule/schedule.router";

const router = Router();

router.use('/api/v1/specialty', specialtyRouter);
router.use('/api/v1/doctor', doctorRouter);
// router.use('/api/v1/patient');
// router.use('/api/v1/appointment');
router.use('/api/v1/user', userRouter);
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/admin', adminRoute);
router.use('/api/v1/super-admin', superAdminRoute);
router.use('/api/v1/schedule', scheduleRoutes);

export const indexRouter = router; 