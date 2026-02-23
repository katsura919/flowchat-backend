import { Router } from "express";
import * as certificationController from "./certification-controller";
import { protect, authorize } from "../../middleware/auth";

const router = Router();

// VA Routes
router.get("/me", protect, authorize('va'), certificationController.getMyCertification);

// Admin Routes
router.get("/", protect, authorize('admin'), certificationController.getAllCertifications);
router.get("/:vaId", protect, authorize('admin'), certificationController.getVaCertification);
router.patch("/:vaId/items", protect, authorize('admin'), certificationController.toggleCertificationItem);

export default router;
