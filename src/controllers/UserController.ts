import {Request, Response} from "express";
import IUserDTO from "../interfaces/DTO/IUserDTO";
import UserService from "../services/UserService";

export default class UserController {
    #service = new UserService();
    async RegisterUser(req: Request, res: Response) : Promise<Response> {
        try {
            const { name, lastName, email, password, companyId } = req.body;
            const response: IUserDTO = await this.#service.Register({ name, lastName, email, password, companyId });
            return res.status(201).json(response);
        } catch (e) {
            console.error(`[server]: ERROR ON: ${e.stack} MESSAGE ::: ${e.message}`);
            return res.status(500).json({ error: 'internal error' });
        }
    }
}