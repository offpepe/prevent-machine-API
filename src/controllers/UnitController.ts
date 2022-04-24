import BaseController from "./BaseController";
import {NextFunction, Request, Response} from "express";
import UnitService from "../services/UnitService";

const service = new UnitService();

export default class UnitController extends BaseController{
    constructor() {
        super();
    }

    public async CreateUnit(req: Request, res:Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            const { tokenData: { userId: managerId }, name, description } = req.body;
            UnitController.ValidateId(companyId);
            UnitController.ValidateId(managerId);
            const result = await service.CreateUnit({ companyId, managerId }, { name, description });
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async UpdateUnit(req: Request, res:Response, next: NextFunction) {
        try {
            const { companyId, unitId } = req.params
            const { tokenData: { userId: managerId }, name, description } = req.body;
            UnitController.ValidateId(companyId);
            UnitController.ValidateId(managerId);
            UnitController.ValidateId(unitId);
            const result = await service.UpdateUnit({ companyId, managerId }, unitId, { name, description });
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async GetUnit(req: Request, res:Response, next: NextFunction) {
        try {
            const { companyId ,unitId } = req.params;
            UnitController.ValidateId(companyId);
            UnitController.ValidateId(unitId);
            const result = await service.GetUnit(unitId, companyId);
            return res.status(200).json(result);
        }
        catch (e) {
            return next(e);
        }
    }

    public async ListUnits(req: Request, res:Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            UnitController.ValidateId(companyId);
            const result = await service.ListUnits(companyId);
            return res.status(200).json(result);
        }
        catch (e) {
            return next(e);
        }
    }

    public async DeleteUnit(req: Request, res:Response, next: NextFunction) {
        try {
            const { companyId,unitId } = req.params;
            const { tokenData: { userId: managerId } } = req.body;
            UnitController.ValidateId(companyId);
            UnitController.ValidateId(managerId);
            UnitController.ValidateId(unitId);
            const response = await service.DeleteUnit(unitId, { managerId, companyId });
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }
}