import UnitDTO from "../Unit/UnitDTO";
import * as stream from "stream";
import Unit from "../../entities/Unit";
import Asset from "../../entities/Asset";
import UnitDTOTiny from "../Unit/UnitDTO.tiny";
import AssetStatus from "../../enums/AssetStatus";

export default class AssetDTO {
    id: string;
    name: string;
    description: string;
    model: string;
    image: string;
    status: string;
    healthLevel: string;
    owner: UnitDTOTiny;

    constructor(id: string, name: string, description: string, model: string, image: string, status: number, healthLevel: number, owner: Unit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.model = model;
        this.image = image;
        this.status = AssetStatus[status];
        this.healthLevel = `${(healthLevel * 100)}%`;
        this.owner = UnitDTOTiny.MapToDTO(owner);
    }

public static MapToDTO({ id, name, description, model, image, status, healthLevel, owner }: Asset) {
        return new AssetDTO(id, name, description, model, image, status, healthLevel, owner);
    }
}