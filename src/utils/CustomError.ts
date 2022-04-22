
export default class CustomError extends Error {
    public code: number;
    public message: string;
    public stack?: string;
    constructor(code: number, message: string) {
        super(message);
        this.message = message;
        this.code = code;
    }

    public static EntityNotFound(message: string) {
        return new CustomError(404, message);
    }

    public static BadRequest(message: string) {
        return new CustomError(400, message);
    }

    public static Unauthorized(message: string) {
        return new CustomError(401, message);
    }

    public static Conflict(message: string) {
        return new CustomError(409, message);
    }

    public static Internal() {
        return new CustomError(500, 'internal error');
    }
}
