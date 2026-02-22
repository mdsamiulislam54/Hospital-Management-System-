import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.get('/', specialtyController.getSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);
router.post('/', specialtyController.createSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);
router.patch('/:id', specialtyController.updateSpecialty);

export const specialtyRouter = router;