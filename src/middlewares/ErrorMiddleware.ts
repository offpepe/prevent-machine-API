import {NextFunction, Request, Response} from "express";
import CustomError from "../utils/CustomError";

export default (err:CustomError , _req:Request, res:Response, _next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    const message = status === 500 ? 'internal error' : err.message;
    return res.status(status).json({ error: message });
}