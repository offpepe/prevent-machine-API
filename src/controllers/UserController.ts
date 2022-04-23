import {NextFunction, Request, Response} from "express";
import IUserDTO from "../models/interfaces/DTO/IUserDTO";
import UserService from "../services/UserService";
import CustomError from "../utils/CustomError";
import {ObjectId} from "mongodb";

const service = new UserService()

export default class UserController {
    async RegisterUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, lastName, email, password, companyId} = req.body;
            const response: IUserDTO = await service.Register({name, lastName, email, password, companyId});
            return res.status(201).json(response);
        } catch (e) {
            return next(e);
        }
    }

    async GetUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            if (!ObjectId.isValid(id)) return next(CustomError.BadRequest('id needs to be a ObjectId'));
            const response: IUserDTO = await service.GetUser(id);
            return res.status(200).json(response);
        } catch(e) {
            return next(e);
        }
    }

    async ListUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users: IUserDTO[] = await service.ListUsers();
            return res.status(200).json(users);
        } catch (e) {
            return next(e);
        }
    }

    async UpdateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {name, lastName, email, role} = req.body
            const response: IUserDTO = await service.UpdateUser({name, lastName, email, role}, id);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }

    async DeleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const response = await service.DeleteUser(id);
            res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }
}