import { IRegisterUserResponse, IRegisterUserRequest } from "../DTO/IRegisterUser";
import IUserDTO from "../DTO/IUserDTO";
import IDeleteUser from "../DTO/IDeleteUser";
import {IUpdateUserRequest, IUpdateUserResponse} from "../DTO/IUpdateUser";

export default interface IUserService {
    Register: (userData: IRegisterUserRequest) => Promise<IUserDTO>;
    UpdateUser: (userData: IUpdateUserRequest) => Promise<IUpdateUserResponse>;
    GetUser : (userId: string) => Promise<IUserDTO>;
    ListUsers: () => Promise<[IUserDTO]>;
    DeleteUser: (userId: string) => Promise<IDeleteUser>;
}