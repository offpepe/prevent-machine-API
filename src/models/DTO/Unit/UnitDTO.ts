import CompanyDTO from "../Company/CompanyDTO";
import Unit from "../../entities/Unit";

export default class UnitDTO {
    id: string;
    name: string;
    description: string;
    owner: CompanyDTO;
    assets?: any[];

    constructor(id: string, name: string, description: string, owner: CompanyDTO, assets?: any[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.assets = assets;
    }

    public static async MapToDTO({ id, name, description, owner, assets }: Unit) {
        return new UnitDTO(id, name, description, CompanyDTO.MapToDTO(owner), assets);
    }
}