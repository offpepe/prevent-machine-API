import IUnit from "./IUnit";

export default interface IAsset {
    id: string,
    name: string,
    description: string,
    mode: string,
    image: string,
    status: number,
    healthLevel: number,
    ownerId: string,
    owner: IUnit,
}