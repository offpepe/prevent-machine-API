import CompanyController from "../controllers/CompanyController";
import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware";

const controller = new CompanyController();
const router = express.Router();

router.get('/', authMiddleware, controller.ListCompanies);
router.post('/', authMiddleware, controller.RegisterCompany);
router.put('/:companyId', authMiddleware, controller.IncludeMembers);
router.put('/remove-members/:companyId', authMiddleware, controller.RemoveMembers);
router.delete('/:companyId', authMiddleware, controller.DeleteCompany);


export default router;