import {NextFunction, Request, Response} from "express";
import joi from "joi";
import CustomError from "../../../utils/CustomError";

const schema = joi.object({
    name: joi.string().min(2).max(90).required(),
    description: joi.string().min(30).max(256).required(),
});

export default (req: Request, _res: Response, next: NextFunction): void => {
    const { name, description } = req.body;
    const { error } = schema.validate({ name, description });
    if (error) return next(CustomError.BadRequest(error.message));
    return next();
}