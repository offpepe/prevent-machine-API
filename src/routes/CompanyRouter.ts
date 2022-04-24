import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import CompanyController from "../controllers/CompanyController";

const controller = new CompanyController();
const router = express.Router();

router.get('/', authMiddleware, controller.ListCompanies);
router.post('/', authMiddleware, controller.RegisterCompany);
router.put('/:companyId', authMiddleware, controller.UpdateCompany);
router.put('/members/:companyId', authMiddleware, controller.IncludeMembers);
router.put('/remove-members/:companyId', authMiddleware, controller.RemoveMembers);
router.delete('/:companyId', authMiddleware, controller.DeleteCompany);


export default router;