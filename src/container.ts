import diContainer from 'true-di';

import { getHttpServer } from "./config/HttpServer";
import {EventBus, IEventBus} from './Libs/EventBus';
import Logger, {ILogger} from './Libs/Logger';
import {IWebServer} from './Libs/WebServer';
import WebSocket, {IWebSocket} from './Libs/WebSocket';
import Whatsapp, {IWhatsapp} from './Libs/Whatsapp';
import TextMessageCreator, {ITextMessageCreator} from './Services/Message/TextMessageCreator';
import MediaUrlMessageCreator, {IMediaUrlMessageCreator} from './Services/Message/MediaUrlMessageCreator';
import WebServer from './Libs/WebServer';

type IServices = {
    logger: ILogger;
    eventBus: IEventBus;
    whatsapp: IWhatsapp;
    webServer: IWebServer;
    webSocket: IWebSocket;
    textMessageCreator: ITextMessageCreator;
    mediaUrlMessageCreator: IMediaUrlMessageCreator;
};

const webConfig = getHttpServer();

export default diContainer < IServices > ({
    logger: () =>
        new Logger(),
    eventBus: () =>
        EventBus.getInstance(),
    whatsapp: () =>
        new Whatsapp(),

    webServer: () =>
        new WebServer(webConfig.app),

    webSocket: () =>
        new WebSocket(webConfig.server),

    textMessageCreator: ({whatsapp}) =>
        new TextMessageCreator(whatsapp),

    mediaUrlMessageCreator: ({whatsapp}) =>
        new MediaUrlMessageCreator(whatsapp),
});
