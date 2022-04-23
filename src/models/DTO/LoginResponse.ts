import IUserDTO from "../interfaces/DTO/IUserDTO";

export default class LoginResponse {
    public userData: IUserDTO;
    public token: string;
    constructor(userData: IUserDTO, token: string) {
        this.userData = userData;
        this.token = token;
    }
}