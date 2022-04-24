import Company from "./Company";

export default class User {
    id: string;
    name: string;
    email: string;
    password: string;
    lastName: string;
    role: number;
    companyId?: string;
    company?: Company;
}