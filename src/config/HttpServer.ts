import express from 'express'
import Http from 'http'
import getConfig from './GlobalConfig'
import Logger from '../Libs/Logger'

export interface IHttpServer {
    app: express.Application
    server: Http.Server
}

export function getHttpServer (): IHttpServer {
    const app = express()
    const server = Http.createServer(app)
    const port = getConfig<number>('port', 3000)
    const logger = new Logger('HttpServer', 'yellow')

    server.listen(port, () => {
        logger.info(`⚡ Listening http://0.0.0.0:${port}`)
    })

    return {
        app,
        server
    }
}
