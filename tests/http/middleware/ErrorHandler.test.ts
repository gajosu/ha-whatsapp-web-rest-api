import { ValidationError } from './../../../src/Exceptions/ValidationError'
import mockLogger from '..//../stubs/Logger'
import Express from 'express'
import handleErrors from '../../../src/http/middlewares/ErrorHandler'
import { NotFoundError } from './../../../src/Exceptions/NotFoundError'

function returnThis (): any { return this }

const fakeResponse = (): Express.Response => ({
    status: jest.fn(returnThis),
    json: jest.fn(returnThis)
}) as any

beforeEach(() => {
    jest.clearAllMocks()
})

describe('handleErrors', () => {
    it('handles ValidationError', () => {
        const res = fakeResponse()
        const next = jest.fn()
        const error = new ValidationError(['error'])

        handleErrors(error, {} as any, res, next)({ logger: mockLogger })

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({ errors: ['error'] })
        expect(mockLogger.warn).toHaveBeenCalledWith(error.message, error.messages)
    })

    it('handles NotFoundError', () => {
        const res = fakeResponse()
        const next = jest.fn()
        const error = new NotFoundError('entity')

        handleErrors(error, {} as any, res, next)({ logger: mockLogger })

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: error.message })
        expect(mockLogger.warn).toHaveBeenCalledWith(error.message)
    })

    it('handles other errors', () => {
        const res = fakeResponse()
        const next = jest.fn()
        const error = new Error('error')

        handleErrors(error, {} as any, res, next)({ logger: mockLogger })

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
        expect(mockLogger.error).toHaveBeenCalledWith('Internal Server Error', error)
    })
})
