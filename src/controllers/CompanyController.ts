import CompanyService from "../services/CompanyService";
import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {autoInjectable, injectable} from "tsyringe";

const service = new CompanyService();

@autoInjectable()
class CompanyController extends BaseController {
    public async RegisterCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, tokenData: { userId }} = req.body;
            const response = await service.RegisterCompany(name, description, userId);
            return res.status(201).json(response);
        } catch (e) {
            return next(e);
        }
    }

    public async IncludeMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params;
            CompanyController.ValidateId(companyId);
            const {tokenData: {userId}, newMembers} = req.body;
            const response = await service.IncludeMembersRange(userId, companyId, newMembers);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }

    public async ListCompanies(_req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await service.ListAllMembers();
            return res.status(200).json(companies);
        } catch (e) {
            next(e);
        }
    }

    public async RemoveMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params;
            CompanyController.ValidateId(companyId);
            const {tokenData: {userId}, members} = req.body;

            const result = await service.RemoveMembersRange(userId, companyId, members);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async UpdateCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            CompanyController.ValidateId(companyId);
            const { tokenData: { userId }, name, description } = req.body;
            const result = await service.UpdateCompany(companyId, userId, { name, description });
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async DeleteCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            CompanyController.ValidateId(companyId);
            const { tokenData: { userId } } = req.body;
            const result = await service.DeleteCompany(companyId, userId);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }
}

export default CompanyController;