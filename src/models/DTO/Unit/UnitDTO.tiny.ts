import Unit from "../../entities/Unit";

export default class UnitDTOTiny {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static MapToDTO({ id, name }: Unit) {
        return new UnitDTOTiny(id, name);
    }
}