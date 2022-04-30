import {NextFunction, Request, Response} from "express";
import joi from "joi";
import CustomError from "../../../utils/CustomError";
import {ObjectId} from "mongodb";

const itemScheme = joi.string().required();

const schema = joi.object({
    members: joi.array().items(itemScheme).required(),
})

export default (req: Request, _res: Response, next: NextFunction): void => {
    const { members } = req.body;
    const { error } = schema.validate({ members });
    if (error) return next(CustomError.BadRequest(error.message));
    if (!members.every((id) => ObjectId.isValid(id))) return next(CustomError.BadRequest('member id must be objectId'));
    return next();
}