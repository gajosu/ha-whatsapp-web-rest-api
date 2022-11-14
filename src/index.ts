import { getHttpServer } from "./config/HttpServer";
import Controller from "./Libs/Controller";
import WebServer from "./Libs/WebServer";
import WebSocket from "./Libs/WebSocket";
import Whatsapp from "./Libs/Whatsapp";


const webConfig = getHttpServer();

const whatsapp = new Whatsapp();
const webServer = new WebServer(webConfig.app);
const webSocket = new WebSocket(webConfig.server);

const controller = new Controller(whatsapp, webServer, webSocket);
controller.start();