import {NextFunction, Request, Response} from "express";
import joi from "joi";
import CustomError from "../../../utils/CustomError";
import {ObjectId} from "mongodb";

const schema = joi.object({
    name: joi.string().min(2).max(90).required(),
    description: joi.string().min(30).max(256).required(),
    model: joi.string().min(1).max(256).required(),
    image: joi.string().uri().required(),
    status: joi.number().min(0).max(2).required(),
});

export default (req: Request, _res: Response, next: NextFunction): void => {
    const {name, description, model, image, status} = req.body;
    const { unitId, assetId } = req.params;
    const {error} = schema.validate({name, description, model, image, status});
    if (error) return next(CustomError.BadRequest(error.message));
    if(![unitId, assetId].every((id) => ObjectId.isValid(id))) return next('id must be ObjectId');
    return next();
}