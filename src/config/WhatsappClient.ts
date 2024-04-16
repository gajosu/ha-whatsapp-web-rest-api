import { Client, LocalAuth } from 'whatsapp-web.js'

export function getClient (): Client {
    return new Client({
        authStrategy: new LocalAuth({
            dataPath: '/data'
        }),
        puppeteer: {
            executablePath: '/usr/bin/chromium',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--unhandled-rejections=strict'
            ]
        },
        webVersionCache: {
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
            type: 'remote'
        }
    })
}
