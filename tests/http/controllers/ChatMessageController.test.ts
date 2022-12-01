import request from 'supertest'
import testServer from '../../utils/TestWebServer'

const mockGroupChatCreator = {
    create: jest.fn().mockResolvedValue({ gid: '1234567890', missingParticipants: [] })
}

jest.mock('../../../src/Services/GroupChat/GroupChatCreator', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatCreator
    })
})

describe('ChatMessageController', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('create group', async () => {
        await request(testServer.app)
            .post('/api/chats/groups')
            .send({
                name: 'TEST',
                participants: ['15616161@c.us']
            })
            .expect(201, { gid: '1234567890', missingParticipants: [] })

        expect(mockGroupChatCreator.create).toBeCalledTimes(1)
        expect(mockGroupChatCreator.create).toBeCalledWith('TEST', ['15616161@c.us'])
    })
})
