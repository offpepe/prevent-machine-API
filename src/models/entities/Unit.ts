import Company from "./Company";

export default class Unit {
    id: string;
    name: string;
    description: string;
    assets?: any[];
    ownerId: string;
    owner?: Company;
}