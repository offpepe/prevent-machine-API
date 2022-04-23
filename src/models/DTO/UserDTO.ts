import IUserDTO from "../interfaces/DTO/IUserDTO";
import Roles from "../enums/Roles";

export class UserDTO implements IUserDTO {
    email: string;
    fullName: string;
    id: string;
    lastName: string;
    name: string;
    role: string;

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