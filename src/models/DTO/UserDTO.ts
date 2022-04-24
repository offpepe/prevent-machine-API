import IUserDTO from "../interfaces/DTO/IUserDTO";
import Roles from "../enums/Roles";
import Company from "../entities/Company";

export class UserDTO implements IUserDTO {
    email: string;
    fullName: string;
    id: string;
    lastName: string;
    name: string;
    role: string;
    company?: Company;

    static MapToDTO({id, name, lastName, email, role, company}): UserDTO {
        return {
            id,
            name,
            lastName,
            fullName: `${name} ${lastName}`,
            email,
            role: Roles[role],
            company,
        }
    }

}