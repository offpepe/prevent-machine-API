import UnitDTO from "../Unit/UnitDTO";
import * as stream from "stream";
import Unit from "../../entities/Unit";
import Asset from "../../entities/Asset";

export default class AssetDTO {
    id: string;
    name: string;
    description: string;
    model: string;
    image: string;
    status: number;
    healthLevel: string;
    owner: UnitDTO;

    constructor(id: string, name: string, description: string, model: string, image: string, status: number, healthLevel: number, owner: Unit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.model = model;
        this.image = image;
        this.status = status;
        this.healthLevel = `${(healthLevel * 100)}%`;
        this.owner = UnitDTO.MapToDTO(owner);
    }

    public static MapToDTO({ id, name, description, model, image, status, healthLevel, owner }: Asset) {
        return new AssetDTO(id, name, description, model, image, status, healthLevel, owner);
    }
}