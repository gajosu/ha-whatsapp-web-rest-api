import GroupChatInvite from '../../../src/Services/GroupChat/GroupChatInvite'
import { mockGroupChatFinder, mockGroupChat } from '../../stubs/services/GroupChat/GroupChatFinder'
import { mockWhatsapp } from '../../stubs/Whatsapp'

describe('group chat invite service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get code', async () => {
        mockGroupChat.getInviteCode.mockResolvedValue('123')
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatInvite(mockWhatsapp, mockGroupChatFinder)
        const code = await service.getCode('123')

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.getInviteCode).toBeCalled()
        expect(code).toEqual('123')
    })

    it('revoke code', async () => {
        mockGroupChat.revokeInvite.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatInvite(mockWhatsapp, mockGroupChatFinder)
        await service
            .revokeCode('123')

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.revokeInvite).toBeCalled()
    })

    it('accept invite', async () => {
        const client = mockWhatsapp.getClient()
        client.acceptInvite.mockResolvedValue('123')

        const service = new GroupChatInvite(mockWhatsapp, mockGroupChatFinder)
        const groupId = await service
            .acceptInvite('123')

        expect(client.acceptInvite).toBeCalledWith('123')
        expect(groupId).toEqual('123')
    })

    it('leave group', async () => {
        mockGroupChat.leave.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatInvite(mockWhatsapp, mockGroupChatFinder)
        await service
            .leave('123')

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.leave).toBeCalled()
    })
})
