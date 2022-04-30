import {NextFunction, Request, Response} from "express";
import joi from 'joi';
import CustomError from "../../../utils/CustomError";

const schema = joi.object({
    name: joi.string().min(2).max(100),
    lastName: joi.string().min(2).max(256),
    email: joi.string().email(),
    role: joi.number().min(0).max(4),
})

export default (req: Request, res: Response, next: NextFunction) => {
    const {name, lastName, email, role} = req.body;
    const { error } = schema.validate({ name, lastName, email, role });
    if (error) return next(CustomError.BadRequest(error.message));
    return next();
}