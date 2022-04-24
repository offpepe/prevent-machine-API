import User from "./User";

export default class Company {
    id: string;
    name: string;
    description?: string;
    workers?: User[];
}