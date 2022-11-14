import {Client} from 'whatsapp-web.js'
import Logger from './Logger';
import {EventBus} from './EventBus';
import WAWebJS from 'whatsapp-web.js';
import Qrcode from 'qrcode-terminal';
import {getClient as getWhatsappClient} from '../config/WhatsappClient';

export default class Whatsapp {

    private static client?: Client = undefined;
    // logger
    private logger : Logger = new Logger('Whatsapp', 'green');

    public async start(): Promise < void > {
        this.logger.info('Starting Client');

        const client = this.getClient();

        client.on('qr', this.onQr.bind(this));
        client.on('ready', this.onReady.bind(this));
        client.on('loading_screen', this.onLoadingScreen.bind(this));
        client.on('authenticated', this.onAuthenticated.bind(this));
        client.on('disconnected', this.onDisconnected.bind(this));
        client.on('message', this.onMessage.bind(this));

        return client.initialize().then(() => {
            this.logger.info('Client initialized');
        }).catch((err) => {
            this.logger.error('Client fatal error');

            throw err;
        });
    }

    public stop(): void {
        this.logger.info('Stopping Client');
        this.getClient().destroy();
    }

    private onReady(): void {
        this.logger.info('Client is ready!');
        EventBus.getInstance().dispatch('whatsapp.ready');
    }

    private onAuthenticated(): void {
        this.logger.info("Client is authenticated");
        EventBus.getInstance().dispatch('whatsapp.authenticated');
    }

    private onDisconnected(): void {
        const client = this.getClient();
        client.destroy();
        client.initialize();

        this.logger.info("Client is disconnected");
        EventBus.getInstance().dispatch('whatsapp.disconnected');
    }

    private onLoadingScreen(): void {
        this.logger.info('Client is loading screen');
    }

    private onQr(qr: string): void {
        this.logger.info('QR Code Received', qr);
        Qrcode.generate(qr, {small: true});
        EventBus.getInstance().dispatch('whatsapp.qr', qr);
    }

    private onMessage(message: WAWebJS.Message): void {
        this.logger.info('Message received', message);
        EventBus.getInstance().dispatch('whatsapp.message', message);
    }

    public getClient(): Client {
        if (Whatsapp.client === undefined) {
            Whatsapp.client = getWhatsappClient();
        }
        return Whatsapp.client;
    }
}
