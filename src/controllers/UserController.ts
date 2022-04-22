import {NextFunction, Request, Response} from "express";
import IUserDTO from "../models/interfaces/DTO/IUserDTO";
import UserService from "../services/UserService";

const service = new UserService()

export default class UserController {
    async RegisterUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const {name, lastName, email, password, companyId} = req.body;
            const response: IUserDTO = await service.Register({name, lastName, email, password, companyId});
            return res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }

    async GetUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const response: IUserDTO = await service.GetUser(id);
            return res.status(200).json(response);
        } catch (e) {
            console.error(e);
            if (e.code) return res.status(e.code).json({ error: e.message });
            return res.status(500).json({error: 'internal error'});
        }
    }

    async ListUsers(_req: Request, res: Response) {
        try {
            const users:IUserDTO[] = await service.ListUsers();
            return res.status(200).json(users);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: 'internal error'});
        }
    }

    async UpdateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, lastName, email, role } = req.body
            const response: IUserDTO = await service.UpdateUser({ name, lastName, email, role }, id);
            return res.status(200).json(response);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: 'internal error'});
        }
    }

    async DeleteUser(req: Request, res:Response) {
        try {
            const { id } = req.params;
            const response = await service.DeleteUser(id);
            res.status(200).json(response);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: 'internal error'});
        }
    }
}