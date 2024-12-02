import { Client, LocalAuth } from 'whatsapp-web.js'

export function getClient (): Client {
    return new Client({
        authStrategy: new LocalAuth({
            dataPath: '/data'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--unhandled-rejections=strict'
            ]
        }
    })
}
