import Company from "../../entities/Company";
import Roles from "../../enums/Roles";

export default class UserDTOTiny {
    email: string;
    fullName: string;
    id: string;
    lastName: string;
    name: string;
    role: string;

    static MapToDTO({id, name, lastName, email, role}): UserDTOTiny {
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