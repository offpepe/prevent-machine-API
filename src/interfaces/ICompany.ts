import IUser from "./IUser";
import IUnit from "./IUnit";

export default interface ICompany {
    id: string,
    name: string,
    workers: [IUser],
    units: [IUnit],
}