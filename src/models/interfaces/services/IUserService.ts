import IRegisterUserRequest from "../DTO/IRegisterUser";
import IUserDTO from "../DTO/IUserDTO";
import IDeleteUser from "../DTO/IDeleteUser";
import IUpdateUserRequest from "../DTO/IUpdateUser";

export default interface IUserService {
    Register: (userData: IRegisterUserRequest) => Promise<IUserDTO>;
    UpdateUser: (userData: IUpdateUserRequest, userId: string) => Promise<IUserDTO>;
    GetUser : (userId: string) => Promise<IUserDTO>;
    ListUsers: () => Promise<IUserDTO[]>;
    DeleteUser: (userId: string) => Promise<IDeleteUser>;
}