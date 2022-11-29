import request from 'supertest'
import testServer from '../../utils/TestWebServer'

// mockFinder.find.mockReturnValue(mockChat)

const chats = [
    {
        id: '5511999999999',
        name: 'Test',
        isGroup: false,
        isOnline: true
    }
]

const mockChatGetter = {
    all: jest.fn().mockResolvedValue(chats)
}

jest.mock('../../../src/Services/Chat/ChatGetter', () => {
    return jest.fn().mockImplementation(() => {
        return mockChatGetter
    })
})

const mockArchive = {
    archive: jest.fn(),
    unarchive: jest.fn()
}

jest.mock('../../../src/Services/Chat/ChatArchive', () => {
    return jest.fn().mockImplementation(() => {
        return mockArchive
    })
})

const mockPin = {
    pin: jest.fn(),
    unpin: jest.fn()
}

jest.mock('../../../src/Services/Chat/ChatPin', () => {
    return jest.fn().mockImplementation(() => {
        return mockPin
    })
})

const mockReader = {
    read: jest.fn(),
    unread: jest.fn()
}

jest.mock('../../../src/Services/Chat/ChatReader', () => {
    return jest.fn().mockImplementation(() => {
        return mockReader
    })
})

const mockStateSender = {
    typing: jest.fn(),
    recording: jest.fn(),
    clear: jest.fn()
}

jest.mock('../../../src/Services/Chat/ChatStateSender', () => {
    return jest.fn().mockImplementation(() => {
        return mockStateSender
    })
})

const mockDeleter = {
    delete: jest.fn()
}

jest.mock('../../../src/Services/Chat/ChatDeleter', () => {
    return jest.fn().mockImplementation(() => {
        return mockDeleter
    })
})

describe('Chat controller tests', () => {
    afterAll(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get all chats', async () => {
        await request(testServer.app)
            .get('/api/chats')
            .expect(200, chats)

        expect(mockChatGetter.all).toBeCalledTimes(1)
    })

    it('archive a chat', async () => {
        mockArchive.archive.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/archive')
            .expect(204)
        expect(mockArchive.archive).toBeCalledTimes(1)
    })

    it('unarchive a chat', async () => {
        mockArchive.unarchive.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/unarchive')
            .expect(204)
        expect(mockArchive.unarchive).toBeCalledTimes(1)
    })

    it('pin a chat', async () => {
        mockPin.pin.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/pin')
            .expect(204)
        expect(mockPin.pin).toBeCalledTimes(1)
    })

    it('unpin a chat', async () => {
        mockPin.unpin.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/unpin')
            .expect(204)
        expect(mockPin.unpin).toBeCalledTimes(1)
    })

    it('mark a chat as read', async () => {
        mockReader.read.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/mark-as-read')
            .expect(204)
        expect(mockReader.read).toBeCalledTimes(1)
    })

    it('mark a chat as unread', async () => {
        mockReader.unread.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/mark-as-unread')
            .expect(204)
        expect(mockReader.unread).toBeCalledTimes(1)
    })

    it('send typing state', async () => {
        mockStateSender.typing.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/send-typing')
            .expect(204)
        expect(mockStateSender.typing).toBeCalledTimes(1)
    })

    it('send recording state', async () => {
        mockStateSender.recording.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/send-recording')
            .expect(204)
        expect(mockStateSender.recording).toBeCalledTimes(1)
    })

    it('clear state', async () => {
        mockStateSender.clear.mockResolvedValue(true)

        await request(testServer.app)
            .put('/api/chats/1234/clear-state')
            .expect(204)
        expect(mockStateSender.clear).toBeCalledTimes(1)
    })

    it('delete a chat', async () => {
        mockDeleter.delete.mockResolvedValue(true)

        await request(testServer.app)
            .delete('/api/chats/1234')
            .expect(204)
        expect(mockDeleter.delete).toBeCalledTimes(1)
    })
})
