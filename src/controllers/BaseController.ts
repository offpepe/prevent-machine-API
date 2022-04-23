import {ObjectId} from "mongodb";
import CustomError from "../utils/CustomError";
import {injectable} from "tsyringe";

@injectable()
export default class BaseController {
    static ValidateId(id:string) {
        if (!ObjectId.isValid(id)) throw CustomError.BadRequest('id needs to be a ObjectId');
    }
}