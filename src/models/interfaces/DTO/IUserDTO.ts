import Company from "../../entities/Company";

export default interface IUserDTO {
    id: string,
    email: string,
    name: string,
    lastName: string,
    fullName: string,
    role: string,
    company?: Company,
}