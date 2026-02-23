import { Router } from "express";
import { protect, authorize } from "../../middleware/auth";
import {
    getAllEodReports,
    getEodSummary
} from "./eod-management-controller";

const router: Router = Router();

// All routes require authentication and "admin" role
router.use(protect);
router.use(authorize("admin"));

// GET /api/admin/reports/eod - List all reports with filters
router.get("/", getAllEodReports);

// GET /api/admin/reports/eod/summary - KPI aggregations
router.get("/summary", getEodSummary);

export default router;
