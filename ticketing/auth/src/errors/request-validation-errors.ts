import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class RequestValidationError extends CustomError {
    statusCode: number = 400;

    constructor(private errors: ValidationError[]) {
        super("Invalid parameters.");

        // Only required because we are extending a built in class (Error)
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param };
        });
    }
}