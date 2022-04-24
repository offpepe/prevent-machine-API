import CompanyService from "../services/CompanyService";
import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {autoInjectable, injectable} from "tsyringe";

const service = new CompanyService();

@autoInjectable()
class CompanyController extends BaseController {
    async RegisterCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, managerId} = req.body;
            CompanyController.ValidateId(managerId);
            const response = await service.RegisterCompany(name, managerId);
            return res.status(201).json(response);
        } catch (e) {
            return next(e);
        }
    }

    async IncludeMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params;
            const {tokenData: {userId}, newMembers} = req.body;
            CompanyController.ValidateId(companyId);
            newMembers.forEach((member) => CompanyController.ValidateId(member));
            const response = await service.IncludeMembersRange(userId, companyId, newMembers);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }

    async ListCompanies(_req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await service.ListAllMembers();
            return res.status(200).json(companies);
        } catch (e) {
            next(e);
        }
    }

    async RemoveMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params;
            const {tokenData: {userId}, members} = req.body;
            const result = await service.RemoveMembersRange(userId, companyId, members);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }
}

export default CompanyController;