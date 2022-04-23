import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import CustomError from "./CustomError";

dotenv.config();

const { SECRET } = process.env;

export default class AuthHandler {
    static GenerateToken(userId, role) {
        return jwt.sign({ userId, role }, SECRET, { expiresIn: 86400 /*1 day*/ })
    }
    static ValidateToken(token) {
        try {
            jwt.verify(token, SECRET);
            return jwt.decode(token);
        } catch (e) {
            throw CustomError.Unauthorized(e.message);
        }
    }
}