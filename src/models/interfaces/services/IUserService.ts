import IRegisterUserRequest from "../DTO/IRegisterUser";
import IUserDTO from "../DTO/IUserDTO";
import IDeleteUser from "../DTO/IDeleteUser";
import IUpdateUserRequest from "../DTO/IUpdateUser";
import LoginResponse from "../../DTO/User/LoginResponse";

export default interface IUserService {
    Login(email:string, password:string) : Promise<LoginResponse>;
    Register: (userData: IRegisterUserRequest) => Promise<IUserDTO>;
    UpdateUser: (userData: IUpdateUserRequest, userId: string) => Promise<IUserDTO>;
    GetUser : (userId: string) => Promise<IUserDTO>;
    ListUsers: () => Promise<IUserDTO[]>;
    DeleteUser: (userId: string) => Promise<IDeleteUser>;
}