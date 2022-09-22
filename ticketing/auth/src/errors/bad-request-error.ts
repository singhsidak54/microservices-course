import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    statusCode: number = 400;
    
    constructor(private reason: string) {
        super(reason);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}