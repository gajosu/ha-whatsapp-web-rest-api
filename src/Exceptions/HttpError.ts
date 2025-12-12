export default class HttpError extends Error {
    constructor (public readonly status: number, message: string) {
        super(message)
        Object.setPrototypeOf(this, HttpError.prototype)
        Error.captureStackTrace(this, HttpError)
    }
}
