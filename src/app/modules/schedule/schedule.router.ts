import { Router } from "express";

import { createScheduleZodSchema, ScheduleValidation } from "./schedule.validation";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post('/', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), zodValidationMiddleware(createScheduleZodSchema) , ScheduleController.createSchedule);
router.get('/', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), ScheduleController.getAllSchedules);
// router.get('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), ScheduleController.getScheduleById);
// router.patch('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN),zodValidationMiddleware(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
// router.delete('/:id', authVerify(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.deleteSchedule);

export const scheduleRoutes = router;