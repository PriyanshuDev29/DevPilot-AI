import { HttpStatus } from "@nestjs/common";

export abstract class AppException extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);

        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}