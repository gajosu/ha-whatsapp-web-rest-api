import express from 'express'
import { ILogger } from './Logger'
import createContext from 'express-async-context'
import container from '../container'
import api from '../routes/api'

export interface IWebServer {
    start: () => void
}

const Context = createContext(() => container)

export default class WebServer implements IWebServer {
    constructor (private readonly app: express.Application, private readonly logger: ILogger) {
        this.logger = logger.getCategoryLogger('WebServer', 'yellow')
    }

    public start (): void {
        this.app.use(Context.provider)
        this.app.use(express.json())

        this.setRoutes()
    }

    private setRoutes (): void {
        this.app.use('/api', api(Context))
        this.app.get('/', (req, res) => {
            res.sendFile('resources/views/index.html', { root: './src/' })
        })
    }
}
