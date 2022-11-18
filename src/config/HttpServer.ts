import express from 'express'
import Http from 'http'

export interface IHttpServer {
    app: express.Application
    server: Http.Server
}

export function getHttpServer (): IHttpServer {
    const app = express()
    const server = Http.createServer(app)

    return {
        app,
        server
    }
}
