import { mockWhatsappClient } from './WhatsappClient'

jest.mock('qrcode-terminal')

export const mockWhatsapp = {
    start: jest.fn(),
    stop: jest.fn(),
    getClient: jest.fn().mockReturnValue(mockWhatsappClient)
}

jest.mock('../../src/Libs/Whatsapp', () => {
    return jest.fn().mockImplementation(() => {
        return mockWhatsapp
    })
})
