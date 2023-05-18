import { mockMessage } from './../../stubs/services/Message/MessageFinder'
import request from 'supertest'
import testServer from '../../utils/TestWebServer'
import { MessageMedia } from 'whatsapp-web.js'

const mockMessageGetter = {
    all: jest.fn()
}

jest.mock('../../../src/Services/Message/MessageGetter', () => {
    return jest.fn().mockImplementation(() => {
        return mockMessageGetter
    })
})

const mockTextSender = jest.fn()

jest.mock('../../../src/Services/Message/TextMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockTextSender
        }
    })
})

const mockFileSender = jest.fn()

jest.mock('../../../src/Services/Message/MediaUrlMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockFileSender
        }
    })
})

const mockStarMessage = {
    star: jest.fn(),
    unstar: jest.fn()
}

jest.mock('../../../src/Services/Message/MessageStar', () => {
    return jest.fn().mockImplementation(() => {
        return mockStarMessage
    })
})

const mockReactMessage = {
    react: jest.fn()
}

jest.mock('../../../src/Services/Message/MessageReact', () => {
    return jest.fn().mockImplementation(() => {
        return mockReactMessage
    })
})

const mockMessaggMediaDownloader = {
    download: jest.fn()
}

jest.mock('../../../src/Services/Message/MessageMediaDownloader', () => {
    return jest.fn().mockImplementation(() => {
        return mockMessaggMediaDownloader
    })
})

const mockDeleteMessage = {
    delete: jest.fn()
}

jest.mock('../../../src/Services/Message/MessageDeleter', () => {
    return jest.fn().mockImplementation(() => {
        return mockDeleteMessage
    })
})

const options = {
    linkPreview: undefined,
    sendAudioAsVoice: undefined,
    sendVideoAsGif: undefined,
    sendMediaAsSticker: undefined,
    sendMediaAsDocument: undefined,
    caption: undefined,
    quotedMessageId: undefined,
    mentions: undefined,
    sendSeen: undefined,
    stickerName: undefined,
    stickerAuthor: undefined,
    stickerCategories: undefined
}

describe('ChatMessageController', () => {
    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    it('get mesages from chat', async () => {
        mockMessageGetter.all.mockResolvedValue([mockMessage])

        await request(testServer.app)
            .get('/api/chats/1234567890/messages')
            .expect(200, JSON.stringify([mockMessage]))

        expect(mockMessageGetter.all).toBeCalledWith('1234567890')
    })

    it('send text message to chat', async () => {
        mockTextSender.mockResolvedValue(mockMessage)

        await request(testServer.app)
            .post('/api/chats/1234567890/messages')
            .send({ msg: 'Test' })
            .expect(200, mockMessage.rawData)

        expect(mockTextSender).toBeCalledTimes(1)
        expect(mockTextSender).toBeCalledWith('1234567890@c.us', 'Test', expect.any(Object))
    })

    it('send text message to chat with options', async () => {
        mockTextSender.mockResolvedValue(mockMessage)

        await request(testServer.app)
            .post('/api/chats/1234567890/messages')
            .send({
                msg: 'Test',
                options: {
                    quotedMessageId: '1234567890',
                    sendAudioAsVoice: true
                }
            })
            .expect(200, mockMessage.rawData)

        expect(mockTextSender).toBeCalledTimes(1)
        expect(mockTextSender).toBeCalledWith('1234567890@c.us', 'Test', { ...options, quotedMessageId: '1234567890', sendAudioAsVoice: true })
    })

    it('send file message to chat', async () => {
        mockFileSender.mockResolvedValue(mockMessage)

        await request(testServer.app)
            .post('/api/chats/1234567890/messages')
            .send({ url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' })
            .expect(200, mockMessage.rawData)

        expect(mockFileSender).toBeCalledTimes(1)
        expect(mockFileSender).toBeCalledWith('1234567890@c.us', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', expect.any(Object))
    })

    it('send file message to chat with options', async () => {
        mockFileSender.mockResolvedValue(mockMessage)

        await request(testServer.app)
            .post('/api/chats/1234567890/messages')
            .send({
                url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
                options: {
                    quotedMessageId: '1234567890',
                    sendAudioAsVoice: true
                }
            })
            .expect(200, mockMessage.rawData)

        expect(mockFileSender).toBeCalledTimes(1)
        expect(mockFileSender).toBeCalledWith(
            '1234567890@c.us',
            'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            { ...options, quotedMessageId: '1234567890', sendAudioAsVoice: true }
        )
    })

    it('star a message', async () => {
        mockStarMessage.star.mockResolvedValue(null)

        await request(testServer.app)
            .put('/api/chats/1234567890/messages/1234567890/star')
            .expect(204)
        expect(mockStarMessage.star).toBeCalledTimes(1)
    })

    it('unstar a message', async () => {
        mockStarMessage.unstar.mockResolvedValue(null)

        await request(testServer.app)
            .put('/api/chats/1234567890/messages/1234567890/unstar')
            .expect(204)
        expect(mockStarMessage.unstar).toBeCalledTimes(1)
    })

    it('react to a message', async () => {
        mockReactMessage.react.mockResolvedValue(null)

        await request(testServer.app)
            .put('/api/chats/1234567890/messages/1234567891/react')
            .send({ reaction: '❤️' })
            .expect(204)
        expect(mockReactMessage.react).toBeCalledTimes(1)
        expect(mockReactMessage.react).toBeCalledWith('1234567890', '1234567891', '❤️')
    })

    it('unreact to a message', async () => {
        mockReactMessage.react.mockResolvedValue(null)

        await request(testServer.app)
            .put('/api/chats/1234567890/messages/1234567891/unreact')
            .expect(204)
        expect(mockReactMessage.react).toBeCalledTimes(1)
        expect(mockReactMessage.react).toBeCalledWith('1234567890', '1234567891', '')
    })

    it('download media message', async () => {
        const base64 = Buffer.from('test').toString('base64')
        const contents = Buffer.from(base64, 'base64')

        mockMessaggMediaDownloader.download.mockResolvedValue(
            new MessageMedia('image/png', base64, 'filename')
        )

        await request(testServer.app)
            .get('/api/chats/1234567890/messages/1234567891/download-media')
            .expect(200)
            .expect('Content-Type', 'image/png')
            .expect('Content-Disposition', 'attachment; filename=1234567890_1234567891.png')
            .expect(contents)

        expect(mockMessaggMediaDownloader.download).toBeCalledTimes(1)
        expect(mockMessaggMediaDownloader.download).toBeCalledWith('1234567890', '1234567891')
    })

    it('delete a message', async () => {
        mockDeleteMessage.delete.mockResolvedValue(null)

        await request(testServer.app)
            .delete('/api/chats/1234567890/messages/1234567890')
            .expect(204)
        expect(mockDeleteMessage.delete).toBeCalledTimes(1)
    })
})
