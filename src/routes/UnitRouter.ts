import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import UnitController from "../controllers/UnitController";

const controller = new UnitController();
const router = Router();

router.get('/:companyId/', authMiddleware, controller.ListUnits);
router.get('/:companyId/:unitId', authMiddleware, controller.GetUnit);
router.post('/:companyId/', authMiddleware, controller.CreateUnit);
router.put('/:companyId/:unitId', authMiddleware, controller.UpdateUnit);
router.delete('/:companyId/:unitId', authMiddleware, controller.DeleteUnit);

export default router;