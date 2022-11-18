import { validationResult } from 'express-validator'
import { Request, Response } from 'express'

const validator = (request: Request, response: Response): void => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        response.status(422).json({ errors: errors.array() })
    }
}

export default validator
