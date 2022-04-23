import {NextFunction, Request, Response} from "express";
import IUserDTO from "../models/interfaces/DTO/IUserDTO";
import UserService from "../services/UserService";
import CustomError from "../utils/CustomError";
import {ObjectId} from "mongodb";
import LoginResponse from "../models/DTO/LoginResponse";
import BaseController from "./BaseController";
import {autoInjectable} from "tsyringe";
import CompanyController from "./CompanyController";

const service = new UserService()
@autoInjectable()
class UserController extends BaseController {

    async LoginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const response:LoginResponse = await service.Login(email, password);
            return res.status(200).json(response);
        } catch (e) {
            return next(e);
        }
    }

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
            CompanyController.ValidateId(id);
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
            CompanyController.ValidateId(id);
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

export default UserController;