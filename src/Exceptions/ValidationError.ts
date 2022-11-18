export class ValidationError extends Error {
    constructor (public messages: any[]) {
        super('Validation failed. ')
        Object.setPrototypeOf(this, ValidationError.prototype)
        Error.captureStackTrace(this, ValidationError)
    }
}
