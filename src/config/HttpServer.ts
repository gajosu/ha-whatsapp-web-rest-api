import express from 'express'
import Http from 'http'
import { getCorsConfig } from './Cors'

export interface IHttpServer {
    app: express.Application
    server: Http.Server
}

export function getHttpServer (): IHttpServer {
    const app = express()
    const server = Http.createServer(app)

    app.use(getCorsConfig())

    return {
        app,
        server
    }
}
