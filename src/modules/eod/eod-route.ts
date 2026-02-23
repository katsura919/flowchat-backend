import { Router } from "express";
import { protect, authorize } from "../../middleware/auth";
import {
    submitEodReport,
    getMyEodReports,
    getLatestEodReport
} from "./eod-controller";

const router: Router = Router();

// All routes require authentication and "va" role
router.use(protect);
router.use(authorize("va"));

// POST /api/eod - Submit report
// GET /api/eod - Get all my reports
router.route("/")
    .post(submitEodReport)
    .get(getMyEodReports);

// GET /api/eod/latest - Get latest report for stats
router.get("/latest", getLatestEodReport);

export default router;
