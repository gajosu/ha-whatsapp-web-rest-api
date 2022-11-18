import { ValidationError as ExpressValidationError } from 'express-validator/src/base'

export class ValidationError extends Error {
    constructor (public messages: ExpressValidationError[]) {
        super('Validation failed. ')
        Object.setPrototypeOf(this, ValidationError.prototype)
        Error.captureStackTrace(this, ValidationError)
    }
}
