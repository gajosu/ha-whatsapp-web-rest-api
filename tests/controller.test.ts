import Controller from '../src/Libs/Controller'
import express from 'express'
import http from 'http'
import { IHttpServer } from '../src/config/HttpServer'

const expressApp = express()
const serverApp = http.createServer(expressApp)
const mockServer = jest.spyOn(serverApp, 'listen').mockImplementation(() => undefined as never)

const mockApp: IHttpServer = {
    app: expressApp,
    server: serverApp
}

const mockLogger = {
    getCategoryLogger: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
}

const mockWhatsapp = {
    start: jest.fn(),
    stop: jest.fn(),
    getClient: jest.fn()
}

const mockWebServer = {
    start: jest.fn(),
    stop: jest.fn()
}

const mockWebSocket = {
    start: jest.fn(),
    stop: jest.fn()
}

jest.mock('../src/config/GlobalConfig', () => {
    return jest.fn().mockImplementation(() => {
        return 3000
    })
})

describe('controller', () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    it('start services', () => {
        const controller = new Controller(mockApp, mockLogger, mockWhatsapp, mockWebServer, mockWebSocket)
        controller.start()

        expect(mockServer).toHaveBeenCalledWith(3000, expect.any(Function))
        expect(mockLogger.info).toBeCalledWith('Starting Controller')
        expect(mockWhatsapp.start).toBeCalledTimes(1)
        expect(mockWebServer.start).toBeCalledTimes(1)
        expect(mockWebSocket.start).toBeCalledTimes(1)
    })
})
