import IUserDTO from "../interfaces/DTO/IUserDTO";

export default class CompanyDTO {
    companyId: string;
    name: string;
    workers: IUserDTO[];

    constructor(companyId: string, name: string, workers: IUserDTO[]) {
        this.companyId = companyId;
        this.name = name;
        this.workers = workers;
    }
}