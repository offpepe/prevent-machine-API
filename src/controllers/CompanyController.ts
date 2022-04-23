import CompanyService from "../services/CompanyService";
import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {autoInjectable, injectable} from "tsyringe";

const service = new CompanyService();
@autoInjectable()
class CompanyController extends BaseController {
    async RegisterCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, managerId } = req.body;
            CompanyController.ValidateId(managerId);
            const response = await service.RegisterCompany(name, managerId);
            return res.status(201).json(response);
        } catch (e) {
            return next(e);
        }
    }
}

export default CompanyController;