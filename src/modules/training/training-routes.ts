import { Router } from "express";
import * as trainingController from "./training-controller";
import { protect, authorize } from "../../middleware/auth";

const router = Router();

// All training routes are protected and for VAs
router.use(protect);
router.use(authorize('va'));

router.get("/me", trainingController.getMyTrainingProgress);
router.patch("/me/modules/:slug", trainingController.updateModuleStatus);
router.get("/me/certification", trainingController.getMyCertification);

export default router;
