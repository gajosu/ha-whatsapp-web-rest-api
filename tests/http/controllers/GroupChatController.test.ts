import request from 'supertest'
import testServer from '../../utils/TestWebServer'

const mockGroupChat = {
    id: {
        server: 'c.us',
        user: '554199999999',
        _serialized: '554199999999@c.us'
    },
    archived: false,
    isGroup: true,
    isReadOnly: false,
    isMuted: false,
    muteExpiration: 0,
    name: 'Test',
    timestamp: 0,
    unreadCount: 0,
    owner: '554199999999',
    createdAt: 0,
    description: 'Test',
    participants: [
        {
            id: {
                server: 'c.us',
                user: '554199',
                _serialized: '554199@c.us'
            },
            isAdmin: false,
            isSuperAdmin: false
        }
    ]
}

const mockGroupChatCreator = {
    create: jest.fn().mockResolvedValue({ gid: '1234567890', missingParticipants: [] })
}

jest.mock('../../../src/Services/GroupChat/GroupChatCreator', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatCreator
    })
})

const mockGroupChatFinder = {
    find: jest.fn().mockResolvedValue(mockGroupChat)
}

jest.mock('../../../src/Services/GroupChat/GroupChatFinder', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatFinder
    })
})

const mockGroupChatUpdater = {
    update: jest.fn().mockResolvedValue(mockGroupChat)
}

jest.mock('../../../src/Services/GroupChat/GroupChatUpdater', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatUpdater
    })
})

const mockGroupChatInvite = {
    getCode: jest.fn().mockResolvedValue('1234567890'),
    revokeCode: jest.fn().mockResolvedValue(undefined),
    acceptInvite: jest.fn().mockResolvedValue('1234567890'),
    leave: jest.fn().mockResolvedValue(undefined)
}

jest.mock('../../../src/Services/GroupChat/GroupChatInvite', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatInvite
    })
})

const mockGroupChatParticipant = {
    add: jest.fn().mockResolvedValue(null),
    remove: jest.fn().mockResolvedValue(null),
    promote: jest.fn().mockResolvedValue(null),
    demote: jest.fn().mockResolvedValue(null)
}

jest.mock('../../../src/Services/GroupChat/GroupParticipant', () => {
    return jest.fn().mockImplementation(() => {
        return mockGroupChatParticipant
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

    it('get group', async () => {
        await request(testServer.app)
            .get('/api/chats/groups/1234567890')
            .expect(200, mockGroupChat)

        expect(mockGroupChatFinder.find).toBeCalledTimes(1)
        expect(mockGroupChatFinder.find).toBeCalledWith('1234567890')
    })

    it('update group', async () => {
        await request(testServer.app)
            .put('/api/chats/groups/1234567890')
            .send({
                name: 'TEST',
                description: 'TEST'
            })
            .expect(204)

        expect(mockGroupChatUpdater.update).toBeCalledTimes(1)
        expect(mockGroupChatUpdater.update).toBeCalledWith('1234567890', 'TEST', 'TEST')
    })

    it('get group invite code', async () => {
        await request(testServer.app)
            .get('/api/chats/groups/1234567890/invite-code')
            .expect(200, { code: '1234567890', url: 'https://chat.whatsapp.com/1234567890' })

        expect(mockGroupChatInvite.getCode).toBeCalledTimes(1)
        expect(mockGroupChatInvite.getCode).toBeCalledWith('1234567890')
    })

    it('revoke group invite code', async () => {
        await request(testServer.app)
            .delete('/api/chats/groups/1234567890/invite-code')
            .expect(204)

        expect(mockGroupChatInvite.revokeCode).toBeCalledTimes(1)
        expect(mockGroupChatInvite.revokeCode).toBeCalledWith('1234567890')
    })

    it('accept group invite code', async () => {
        await request(testServer.app)
            .post('/api/chats/groups/accept-invite/code12345')
            .expect(200, { groupId: '1234567890' })

        expect(mockGroupChatInvite.acceptInvite).toBeCalledTimes(1)
        expect(mockGroupChatInvite.acceptInvite).toBeCalledWith('code12345')
    })

    it('leave group', async () => {
        await request(testServer.app)
            .delete('/api/chats/groups/1234567890')
            .expect(204)

        expect(mockGroupChatInvite.leave).toBeCalledTimes(1)
        expect(mockGroupChatInvite.leave).toBeCalledWith('1234567890')
    })

    it('add participant to group', async () => {
        await request(testServer.app)
            .post('/api/chats/groups/1234567890/participants')
            .send({
                participants: ['3443443@c.us']
            })
            .expect(204)

        expect(mockGroupChatParticipant.add).toBeCalledTimes(1)
        expect(mockGroupChatParticipant.add).toBeCalledWith('1234567890', ['3443443@c.us'])
    })

    it('remove participant from group', async () => {
        await request(testServer.app)
            .delete('/api/chats/groups/1234567890/participants')
            .send({
                participants: ['3443443@c.us']
            })
            .expect(204)

        expect(mockGroupChatParticipant.remove).toBeCalledTimes(1)
        expect(mockGroupChatParticipant.remove).toBeCalledWith('1234567890', ['3443443@c.us'])
    })

    it('promote participant to admin', async () => {
        await request(testServer.app)
            .put('/api/chats/groups/1234567890/participants/promote')
            .send({
                participants: ['3443443@c.us']
            })
            .expect(204)

        expect(mockGroupChatParticipant.promote).toBeCalledTimes(1)
        expect(mockGroupChatParticipant.promote).toBeCalledWith('1234567890', ['3443443@c.us'])
    })

    it('demote participant to admin', async () => {
        await request(testServer.app)
            .put('/api/chats/groups/1234567890/participants/demote')
            .send({
                participants: ['3443443@c.us']
            })
            .expect(204)

        expect(mockGroupChatParticipant.demote).toBeCalledTimes(1)
        expect(mockGroupChatParticipant.demote).toBeCalledWith('1234567890', ['3443443@c.us'])
    })
})
