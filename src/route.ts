import authAdminRoutes from "./modules/auth/admin/auth-admin-route";
import authVaRoutes from "./modules/auth/va/auth-va-route";
import { Router } from "express";

const router: Router = Router();

router.use('/auth/admin', authAdminRoutes);
router.use('/auth/va', authVaRoutes);

export default router;  