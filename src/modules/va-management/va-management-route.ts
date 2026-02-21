import { Router } from "express";
import { protect, authorize } from "../../middleware/auth";
import {
    createVa,
    getVas,
    getVaById,
    updateVaStatus
} from "./va-management-controller";

const router: Router = Router();

// All routes require authentication and "admin" role
router.use(protect);
router.use(authorize("admin"));

// POST /api/admin/vas / GET /api/admin/vas
router.route("/")
    .post(createVa)
    .get(getVas);

// GET /api/admin/vas/:id / PATCH /api/admin/vas/:id
router.route("/:id")
    .get(getVaById)
    .patch(updateVaStatus);

export default router;
