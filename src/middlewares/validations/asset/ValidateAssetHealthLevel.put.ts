import {NextFunction, Request, Response} from "express";
import joi from "joi";
import CustomError from "../../../utils/CustomError";
import {ObjectId} from "mongodb";

const schema = joi.object({
    healthLevel: joi.number().min(0).max(1).required(),
});

export default (req: Request, _res: Response, next: NextFunction): void => {
    const { healthLevel } = req.body;
    const { unitId, assetId } = req.params;
    const { error } = schema.validate({ healthLevel });
    if (error) return next(CustomError.BadRequest(error.message));
    if(![unitId, assetId].every((id) => ObjectId.isValid(id))) return next('id must be ObjectId');
    return next();
}