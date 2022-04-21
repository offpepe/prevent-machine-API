import ICompany from "./ICompany";
import IAsset from "./IAsset";

export default interface IUnit {
    id: string,
    description: string,
    name: string,
    ownerId: string,
    assets: [IAsset],
    owner: ICompany,
}