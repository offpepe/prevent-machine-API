import {NextFunction, Request, Response} from "express";
import joi from 'joi';
import CustomError from "../../../utils/CustomError";
import {ObjectId} from "mongodb";

const schema = joi.object({
    name: joi.string().min(2).max(100).required(),
    lastName: joi.string().min(2).max(256).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(18).required(),
    companyId: joi.string().custom(ObjectId.isValid),
})

export default (req: Request, res: Response, next: NextFunction) => {
    const {name, lastName, email, password, companyId} = req.body;
    const { error } = schema.validate({ name, lastName, email, password, companyId });
    if (error) return next(CustomError.BadRequest(error.message));
    return next();
}