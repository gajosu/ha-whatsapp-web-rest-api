import GroupChatParticipant from '../../../src/Services/GroupChat/GroupParticipant'
import { mockGroupChatFinder, mockGroupChat } from '../../stubs/services/GroupChat/GroupChatFinder'

describe('group chat participants service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('add participants', async () => {
        mockGroupChat.addParticipants.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatParticipant(mockGroupChatFinder)
        await service
            .add('123', ['554199999999'])

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.addParticipants).toBeCalledWith(['554199999999'])
    })

    it('remove participants', async () => {
        mockGroupChat.removeParticipants.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatParticipant(mockGroupChatFinder)
        await service
            .remove('123', ['554199999999'])

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.removeParticipants).toBeCalledWith(['554199999999'])
    })

    it('promote participants', async () => {
        mockGroupChat.promoteParticipants.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatParticipant(mockGroupChatFinder)
        await service
            .promote('123', ['554199999999'])

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.promoteParticipants).toBeCalledWith(['554199999999'])
    })

    it('demote participants', async () => {
        mockGroupChat.demoteParticipants.mockResolvedValue(true)
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatParticipant(mockGroupChatFinder)
        await service
            .demote('123', ['554199999999'])

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.demoteParticipants).toBeCalledWith(['554199999999'])
    })
})
