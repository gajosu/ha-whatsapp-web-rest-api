import express from 'express'
import { ILogger } from './Logger'

export interface IWebServer {
    start: () => void
}

export default class WebServer implements IWebServer {
    constructor (private readonly app: express.Application, private readonly logger: ILogger) {
        this.logger = logger.getCategoryLogger('WebServer', 'yellow')
    }

    public start (): void {
        this.setRoutes()
    }

    private setRoutes (): void {
        this.app.get('/', (req, res) => {
            res.sendFile('resources/views/index.html', { root: './src/' })
        })
    }
}
