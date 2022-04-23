import IRegisterUserRequest from "../models/interfaces/DTO/IRegisterUser";
import IUpdateUserRequest from "../models/interfaces/DTO/IUpdateUser";
import IUserService from "../models/interfaces/services/IUserService";
import IDeleteUser from "../models/interfaces/DTO/IDeleteUser";
import IUserDTO from "../models/interfaces/DTO/IUserDTO";
import prisma from "../prisma";
import { injectable} from "tsyringe";
import Roles from "../models/enums/Roles";
import CustomError from "../utils/CustomError";
import AuthHandler from "../utils/AuthHandler";
import LoginResponse from "../models/DTO/LoginResponse";

@injectable()
export default class UserService implements IUserService {

    async Login(email:string, password:string) : Promise<LoginResponse> {
        const user = await prisma.user.findFirst({
            where: {
                AND: [{ email }, { password }]
            },
        });
        if (!user) throw CustomError.Unauthorized('incorrect email or password');
        const token = AuthHandler.GenerateToken(user.id, user.role);
        return new LoginResponse(UserService.MapToDTO(user), token);
    }

    async GetUser(userId: string): Promise<IUserDTO> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
            }
        });
        if (user === null) throw CustomError.EntityNotFound('user not found');
        return UserService.MapToDTO(user);
    }

    async ListUsers(): Promise<IUserDTO[]> {
        const users = await prisma.user.findMany();
        return users.map((user) => UserService.MapToDTO(user));
    }

    async Register({name, lastName, email, password, companyId }: IRegisterUserRequest): Promise<IUserDTO> {
            const user = await prisma.user.create({
                data: {
                    name,
                    lastName,
                    email,
                    password,
                    companyId,
                    role: 0,
                }
            });
            return UserService.MapToDTO(user);
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

    async UpdateUser({ name, lastName, email, role }: IUpdateUserRequest, userId: string): Promise<IUserDTO> {
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
        });
        return UserService.MapToDTO(userUpdated);
    }

    static MapToDTO({id, name, lastName, email, role}): IUserDTO {
        return {
            id,
            name,
            lastName,
            fullName: `${name} ${lastName}`,
            email,
            role: Roles[role],
        }
    }


}