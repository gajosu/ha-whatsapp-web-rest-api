import { Client, LocalAuth } from 'whatsapp-web.js'

export default class Whatsapp {

    private static client?: Client = undefined;

    public init() {
        const client = this.getClient();
        client.initialize();
    }

    public getClient(): Client {
        if (Whatsapp.client == undefined) {
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


// const client = new Client({
//     authStrategy: new LocalAuth({
//         dataPath: '/data',
//     }),
//     puppeteer: {
//         // chromium path in alpine
//         executablePath: '/usr/bin/chromium',
//         headless: true,
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--unhandled-rejections=strict'
//         ]
//     }
// });

// module.exports.is_authenticated = false;

// client.initialize();

// client.on('ready', () => {
//     // console.log('Client is ready!');
// });

// client.on('authenticated', async (session) => {
//     // console.log('AUTHENTICATED');
//     module.exports.is_authenticated = true;
// });

// client.on('disconnected', async (session) => {
//     // console.log('AUTH_FAILURE');
//     module.exports.is_authenticated = false;
//     client.destroy();
//     client.initialize();
// });

// module.exports.client = client;
