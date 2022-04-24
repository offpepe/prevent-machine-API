import IUserDTO from "../interfaces/DTO/IUserDTO";
import {UserDTO} from "./UserDTO";
import Company from "../entities/Company";
import User from "../entities/User";

export default class CompanyDTO {
    companyId: string;
    name: string;
    workers: IUserDTO[];

    constructor(companyId: string, name: string, workers: IUserDTO[]) {
        this.companyId = companyId;
        this.name = name;
        this.workers = workers;
    }

    static MapToDTO({id, name, workers}: Company) {
        const workersDTO: UserDTO[] = workers.map(({id, name, lastName, email, role, company}) =>
            UserDTO.MapToDTO({
                id,
                name,
                lastName,
                email,
                role,
                company
            }));
        return new CompanyDTO(id, name, workersDTO);
    }
}