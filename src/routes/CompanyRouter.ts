import CompanyController from "../controllers/CompanyController";
import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware";

const controller = new CompanyController();
const router = express.Router();

router.post('/', authMiddleware, controller.RegisterCompany);

export default router;