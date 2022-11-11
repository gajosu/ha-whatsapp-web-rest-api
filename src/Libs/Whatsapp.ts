import { Client, LocalAuth } from 'whatsapp-web.js'
import Logger from '../config/Logger';
import { EventBus } from './EventBus';
import WAWebJS from 'whatsapp-web.js';
//qrcode-terminal
import qrcode from 'qrcode-terminal';

export default class Whatsapp {

    private static client?: Client = undefined;
    // logger
    private logger: Logger = Logger.getInstance();

    public start() {
        this.logger.info('Starting Whatsapp Client');

        const client = this.getClient();

        //qr
        client.on('qr', (qr) => {
            this.logger.info('QR Code Received', qr);
            qrcode.generate(qr, { small: true });

            EventBus.getInstance().dispatch('qr', qr);
        });

        client.on('ready', () => {
            this.logger.info('Client is ready!');
            EventBus.getInstance().dispatch('whatsapp:ready');
        });

        client.on('authenticated', async (session: WAWebJS.ClientSession) => {
            this.logger.info("Client is authenticated with session: ", session);
            EventBus.getInstance().dispatch('whatsapp:authenticated', session);
        });

        client.on('disconnected', async (session: WAWebJS.ClientSession) => {
            client.destroy();
            client.initialize();

            this.logger.info("Client is disconnected with session: ", session);
        });


        client.initialize()
        .then(() => {
            this.logger.info('Whatsapp client initialized');
            this.logger.info('Whatsapp client ready');
        })
        .catch((err) => {
            console.log(err);
            this.logger.error('Whatsapp client initialization failed', err);
        });
    }


    public getClient(): Client {
        if (Whatsapp.client === undefined) {
            Whatsapp.client = new Client({
                authStrategy: new LocalAuth({
                    dataPath: '/data',
                }),
                puppeteer: {
                    executablePath: '/usr/bin/chromium',
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--unhandled-rejections=strict'
                    ]
                }
            });
        }
        return Whatsapp.client;
    }


}
