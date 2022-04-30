import {NextFunction, Request, Response} from "express";
import AuthHandler from "../utils/AuthHandler";
import CustomError from "../utils/CustomError";
import TemporaryStorage from "../utils/TemporaryStorage";

const saveInTempStorage = (userId: string, role: string): void => {

}


export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw CustomError.Unauthorized('token not provided');
        const { userId, role } = AuthHandler.ValidateToken(authorization);
        req.body = { ...req.body, tokenData: { userId, role } };
        await TemporaryStorage.save({ userId, role })
        next();
    } catch (e) {
        next(e);
    }
}