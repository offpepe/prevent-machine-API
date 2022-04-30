import {NextFunction, Request, Response} from "express";
import joi from "joi";
import CustomError from "../../../utils/CustomError";
import {ObjectId} from "mongodb";

const schema = joi.object({
    id: joi.string().required(),
    role: joi.number().min(0).max(4).required(),
})

const schemaList = joi.object({
    newMembers: joi.array().items(schema).required(),
});

export default (req: Request, _res: Response, next: NextFunction): void => {
    const { newMembers } = req.body;
    const { error } = schemaList.validate({ newMembers });
    if (error) return next(CustomError.BadRequest(error.message));
    if (!newMembers.every(({ id }) => ObjectId.isValid(id))) return next(CustomError.BadRequest('member id must be objectId'));
    return next();
}