import fs from 'fs';
import UserTemp from "../models/entities/User.temp";

class TemporaryStorage {
    private _path = './src/public/temp/userData.temp.json';
    public async save(data: UserTemp): Promise<void> {
        fs.writeFileSync(this._path, JSON.stringify(data), { encoding: "utf8" });
    }

    public async pull(): Promise<UserTemp> {
        const data: UserTemp = JSON.parse(fs.readFileSync(this._path, { encoding: "utf8" }));
        fs.writeFileSync(this._path, '', { encoding: 'utf8' });
        return data;
    }
}

export default new TemporaryStorage();