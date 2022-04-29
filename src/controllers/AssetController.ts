import {NextFunction, Request, Response} from "express";
import AssetService from "../services/AssetService";
import CustomError from "../utils/CustomError";

const service = new AssetService()

export default class AssetController {
    public async CreateAsset(req: Request, res: Response, next: NextFunction) {
        try {
            const {unitId: ownerId} = req.params;
            const {tokenData: {userId: managerId}, name, description, model, image, status, healthLevel} = req.body
            const result = await service.CreateAsset({name, description, image, model, status, healthLevel}, {
                ownerId,
                managerId
            });
            return res.status(201).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async UpdateAsset(req: Request, res: Response, next: NextFunction) {
        try {
            const {unitId: ownerId, assetId} = req.params;
            const {tokenData: {userId: managerId}, name, description, model, image, status} = req.body
            const result = await service.UpdateAsset(assetId, { managerId, ownerId}, { name, description, model, status, image });
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async ListAssets(req: Request, res: Response, next: NextFunction) {
        try {
            const { unitId: ownerId } = req.params;
            const { tokenData: { userId: managerId } } = req.body;
            const result = await service.ListAssets({ managerId, ownerId });
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async GetAssetById(req: Request, res: Response, next: NextFunction) {
        try {
            const { unitId: ownerId, assetId } = req.params;
            const { tokenData: { userId: managerId } } = req.body;
            const result = await service.GetAssetById({ ownerId, managerId }, assetId);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }
    
    public async DeleteAsset(req: Request, res: Response, next: NextFunction) {
        try {
            const { unitId: ownerId, assetId } = req.params;
            const { tokenData: { userId: managerId } } = req.body;
            const result = await service.DeleteAsset({ ownerId, managerId }, assetId);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    public async UpdateHealthLevel(req: Request, res: Response, next: NextFunction) {
        try {
            const { assetId } = req.params;
            const { healthLevel } = req.body;
            if (!healthLevel) throw CustomError.BadRequest("healthLevel required");
            const result = await service.ChangeHealthLevel(Number(healthLevel), assetId);
            return res.status(200).json(result);
        } catch (e) {
            return next (e);
        }
    }
}