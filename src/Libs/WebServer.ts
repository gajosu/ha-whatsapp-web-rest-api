import express from "express";
import Logger from "./Logger";

export default class WebServer {;

    private logger: Logger = new Logger('WebServer', 'yellow');

    constructor(private app : express.Application) {
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
