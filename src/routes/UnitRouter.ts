import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import UnitController from "../controllers/UnitController";
import validateUnitPost from "../middlewares/validations/unit/ValidateUnit.post";
import validateUnitPut from "../middlewares/validations/unit/ValidateUnit.put";

const controller = new UnitController();
const router = Router();

router.get('/:companyId/', authMiddleware, controller.ListUnits);
router.get('/:companyId/:unitId', authMiddleware, controller.GetUnit);
router.post('/:companyId/', authMiddleware, validateUnitPost, controller.CreateUnit);
router.put('/:companyId/:unitId', authMiddleware, validateUnitPut,controller.UpdateUnit);
router.delete('/:companyId/:unitId', authMiddleware, controller.DeleteUnit);

export default router;