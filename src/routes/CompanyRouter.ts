import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import CompanyController from "../controllers/CompanyController";
import validateCompanyPost from "../middlewares/validations/company/ValidateCompany.post";
import validateCompanyPut from "../middlewares/validations/company/ValidateCompany.put";
import validateNewMembersPut from "../middlewares/validations/company/ValidateNewMembers.put";
import validateRemoveMemberPut from "../middlewares/validations/company/ValidateRemoveMember.put";

const controller = new CompanyController();
const router = express.Router();

router.get('/', authMiddleware, controller.ListCompanies);
router.post('/', authMiddleware, validateCompanyPost, controller.RegisterCompany);
router.put('/:companyId', authMiddleware, validateCompanyPut, controller.UpdateCompany);
router.put('/members/:companyId', authMiddleware, validateNewMembersPut, controller.IncludeMembers);
router.put('/remove-members/:companyId', authMiddleware, validateRemoveMemberPut,controller.RemoveMembers);
router.delete('/:companyId', authMiddleware, controller.DeleteCompany);


export default router;