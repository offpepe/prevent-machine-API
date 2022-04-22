import ICompany from "./ICompany";

export default interface IUser {
    id: string,
    name: string,
    lastname: string,
    password: string,
    role: number,
    companyId: string,
    company: ICompany,
}