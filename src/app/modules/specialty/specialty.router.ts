import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { authVerify } from "../../middleware/authVerify";
import { UserRole } from "../../../generated/enums";
import { multerUpload } from "../../../config/multer.config";
import { zodValidationMiddleware } from "../../middleware/zodValidation";
import { specialtyZodSchema } from "./specialtyZodSchema";


const router = Router();

router.get('/', authVerify(UserRole.ADMIN, UserRole.PATIENT), specialtyController.getSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);

router.post('/',

    multerUpload.single("file"),
    zodValidationMiddleware(specialtyZodSchema),
    specialtyController.createSpecialty
);
router.delete('/:id', specialtyController.deleteSpecialty);
router.patch('/:id', specialtyController.updateSpecialty);

export const specialtyRouter = router;