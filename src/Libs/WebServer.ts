import express from "express";
import { ILogger } from "./Logger";

export interface IWebServer {
    start(): void;
}

export default class WebServer implements IWebServer {

    constructor(private app: express.Application, private logger: ILogger) {
        this.logger = logger.getCategoryLogger('WebServer', 'yellow')
    }

    public start() {
        this.setRoutes();
    }

    private setRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile('resources/views/index.html', { root: './src/' });
        });
    }
}
