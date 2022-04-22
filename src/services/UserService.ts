import {IRegisterUserRequest} from "../interfaces/DTO/IRegisterUser";
import {IUpdateUserRequest, IUpdateUserResponse} from "../interfaces/DTO/IUpdateUser";
import IUserService from "../interfaces/services/IUserService";
import IDeleteUser from "../interfaces/DTO/IDeleteUser";
import IUserDTO from "../interfaces/DTO/IUserDTO";
import IUser from "../interfaces/entities/IUser";
import prisma from "../prisma";

export default class UserService implements IUserService {
    async GetUser(userId: string): Promise<IUserDTO> {
        const user: IUser = await prisma.User.findOne({
            where: {
                id: userId,
            },
            include: {
                company: true,
            }
        });
        return UserService.MapToDTO(user);
    }

    async ListUsers(): Promise<[IUserDTO]> {
        const users: [IUser] = await prisma.User.findMany();
        const userDtos:[IUserDTO] = [undefined];
        users.forEach((user) => userDtos.push(UserService.MapToDTO(user)));
        return userDtos;
    }

    async Register(userData: IRegisterUserRequest): Promise<IUserDTO> {
        const user: IUser = await prisma.User.create({
            data: {
                ...userData
            },
            include: {
                company: userData.companyId
            }
        });
        return UserService.MapToDTO(user);
    }

    async DeleteUser(userId: string): Promise<IDeleteUser> {
        const user: IUserDTO = await this.GetUser(userId);
        await prisma.User.delete({
            where: {
                id: user.id,
            }
        });
        return {
            userDeleted: user.id,
            message: 'User deleted successfully!',
        }
    }

    UpdateUser(userData: IUpdateUserRequest): Promise<IUpdateUserResponse> {
        return Promise.resolve(undefined);
    }

    static MapToDTO({id, name, lastName, email, role, company}: IUser): IUserDTO {
        return {
            id,
            name,
            lastName,
            fullName: `${name} ${lastName}`,
            email,
            role,
            company,
        }
    }


}