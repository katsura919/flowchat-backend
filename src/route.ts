import authAdminRoutes from "./modules/auth/admin/auth-admin-route";
import authVaRoutes from "./modules/auth/va/auth-va-route";
import vaManagementRoutes from "./modules/va-management/va-management-route";
import trainingRoutes from "./modules/training/training-routes";
import { Router } from "express";

const router: Router = Router();

router.use('/auth/admin', authAdminRoutes);
router.use('/auth/va', authVaRoutes);
router.use('/admin/vas', vaManagementRoutes);
router.use('/va/training', trainingRoutes);

export default router;  