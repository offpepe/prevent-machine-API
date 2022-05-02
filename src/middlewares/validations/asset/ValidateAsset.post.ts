import {NextFunction, Request, Response} from 'express';
import joi from 'joi';
import CustomError from '../../../utils/CustomError';

const schema = joi.object({
    name: joi.string().min(2).max(90).required(),
    description: joi.string().min(15).max(256).required(),
    model: joi.string().min(1).max(256).required(),
    status: joi.number().min(0).max(2).required(),
    healthLevel: joi.number().min(0).max(1).required(),
    image: joi.string().uri().required(),
});

export default (req, _res: Response, next: NextFunction): void => {
    const {name, description, model, status, healthLevel} = req.body;
    const file = req.file;
    if (!file) return next(CustomError.BadRequest('file required!'))
    const {error} = schema.validate({name, description, model, status, healthLevel});
    if (error) return next(CustomError.BadRequest(error.message));
    return next();
}