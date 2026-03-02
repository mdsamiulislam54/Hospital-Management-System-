import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";

const router = Router();

router.get('/', authVerify(UserRole.ADMIN, UserRole.PATIENT), specialtyController.getSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);
router.post('/', specialtyController.createSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);
router.patch('/:id', specialtyController.updateSpecialty);

export const specialtyRouter = router;