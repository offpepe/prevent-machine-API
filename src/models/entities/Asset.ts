import Unit from "./Unit";

export default class Asset {
    id: string;
    name: string;
    description: string;
    model: string;
    image: string;
    status: number;
    healthLevel: number;
    ownerId: string;
    owner: Unit;
}