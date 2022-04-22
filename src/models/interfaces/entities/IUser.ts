import ICompany from "./ICompany";

export default interface IUser {
    id: string,
    name: string,
    email: string,
    lastName: string,
    password: string,
    role: number,
    companyId: string,
    company: ICompany,
}