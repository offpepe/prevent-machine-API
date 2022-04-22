import {Request, Response} from "express";
import CustomError from "../utils/CustomError";

export default (err:CustomError , _req:Request, res:Response) => {
    return res.status(err.code).json({ error: err.message });
}