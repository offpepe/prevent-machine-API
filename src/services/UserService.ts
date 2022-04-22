import IRegisterUserRequest from "../interfaces/DTO/IRegisterUser";
import IUpdateUserRequest from "../interfaces/DTO/IUpdateUser";
import IUserService from "../interfaces/services/IUserService";
import IDeleteUser from "../interfaces/DTO/IDeleteUser";
import IUserDTO from "../interfaces/DTO/IUserDTO";
import prisma from "../prisma";
import { injectable} from "tsyringe";
import Roles from "../enums/Roles";

@injectable()
export default class UserService implements IUserService {
    async GetUser(userId: string): Promise<IUserDTO> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
            }
        });
        if (user === null) throw { code: 404, message: 'user not found' };
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