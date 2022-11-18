import { ValidationError } from './../../Exceptions/ValidationError'
import { validationResult } from 'express-validator'
import { Request, Response } from 'express'

const validator = (request: Request, response: Response): void => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array())
    }
}

export default validator
