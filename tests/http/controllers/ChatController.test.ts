// import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'
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

// const mockArchive = {
//     archive: jest.fn(),
//     unarchive: jest.fn()
// }

// jest.mock('../../../src/Services/Chat/ChatArchive', () => {
//     return jest.fn().mockImplementation(() => {
//         return mockArchive
//     })
// })

describe('Chat controller tests', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('get all chats', async () => {
        await request(testServer.app)
            .get('/api/chats')
            .expect(200, chats)

        expect(mockChatGetter.all).toBeCalledTimes(1)
    })

    // it('archive a chat', async () => {
    //     await request(testServer.app)
    //         .put('/api/chats/1234/archive')
    //         .expect(204)
    //     // expect(mockArchive.archive).toBeCalledTimes(1)
    // })
})
