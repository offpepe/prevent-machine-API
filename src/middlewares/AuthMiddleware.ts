import {NextFunction, Request, Response} from "express";
import AuthHandler from "../utils/AuthHandler";
import CustomError from "../utils/CustomError";


export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw CustomError.Unauthorized('token not provided');
        const { userId, role } = AuthHandler.ValidateToken(authorization);
        req.body = { ...req.body, tokenData: { userId, role } };
        next();
    } catch (e) {
        next(e);
    }
}