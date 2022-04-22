import IGetCompany from "./IGetCompany";

export default interface IUserDTO {
    id: string,
    email: string,
    name: string,
    lastName: string,
    fullName: string,
    role: string,
    company?: IGetCompany,
}