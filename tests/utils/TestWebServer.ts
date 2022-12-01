import WebServer from '../../src/Libs/WebServer'
import container from '../../src/container'
import Logger from '../../src/Libs/Logger'

jest.mock('../../src/config/GlobalConfig', () => {
    return jest.fn().mockImplementation((key: string, defaultValue: any) => {
        return defaultValue
    })
})

container.whatsapp.getClient = jest.fn().mockImplementation(() => {
    return {
        getState: jest.fn().mockResolvedValue('CONNECTED')
    }
})

const app = container.app.app
const webServer = new WebServer(app, new Logger())
webServer.start()

export default {
    app,
    container
}
