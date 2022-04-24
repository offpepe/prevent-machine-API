import IRegisterUserRequest from "../models/interfaces/DTO/IRegisterUser";
import IUpdateUserRequest from "../models/interfaces/DTO/IUpdateUser";
import IUserService from "../models/interfaces/services/IUserService";
import IDeleteUser from "../models/interfaces/DTO/IDeleteUser";
import IUserDTO from "../models/interfaces/DTO/IUserDTO";
import prisma from "../prisma";
import { injectable} from "tsyringe";
import CustomError from "../utils/CustomError";
import AuthHandler from "../utils/AuthHandler";
import LoginResponse from "../models/DTO/LoginResponse";
import {UserDTO} from "../models/DTO/UserDTO";

@injectable()
export default class UserService implements IUserService {

    async Login(email:string, password:string) : Promise<LoginResponse> {
        const user = await prisma.user.findFirst({
            where: {
                AND: [{ email }, { password }]
            },
            include: {
                company: true,
            }
        });
        if (!user) throw CustomError.Unauthorized('incorrect email or password');
        const token = AuthHandler.GenerateToken(user.id, user.role);
        return new LoginResponse(UserDTO.MapToDTO(user), token);
    }

    async GetUser(userId: string): Promise<UserDTO> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
            }
        });
        if (user === null) throw CustomError.EntityNotFound('user not found');
        return UserDTO.MapToDTO(user);
    }

    async ListUsers(): Promise<UserDTO[]> {
        const users = await prisma.user.findMany({ include: { company: true } });
        return users.map((user) => UserDTO.MapToDTO(user));
    }

    async Register({name, lastName, email, password, companyId }: IRegisterUserRequest): Promise<UserDTO> {
            const user = await prisma.user.create({
                data: {
                    name,
                    lastName,
                    email,
                    password,
                    companyId,
                    role: 0,
                },
                include: {
                    company: true,
                }
            });
            return UserDTO.MapToDTO(user);
    }

    async DeleteUser(userId: string): Promise<IDeleteUser> {
        const user: IUserDTO = await this.GetUser(userId);
        await prisma.user.delete({
            where: {
                id: user.id,
            }
        });
        return {
            userDeleted: user.id,
            message: 'User deleted successfully!',
        }
    }

    async UpdateUser({ name, lastName, email, role }: IUpdateUserRequest, userId: string): Promise<UserDTO> {
        const userUpdated = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                lastName,
                email,
                role,
            },
            include: {
                company: true
            }
        });
        return UserDTO.MapToDTO(userUpdated);
    }

}