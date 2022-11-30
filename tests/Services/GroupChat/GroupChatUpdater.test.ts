import GroupChatUpdater from '../../../src/Services/GroupChat/GroupChatUpdater'
import { mockGroupChatFinder, mockGroupChat } from '../../stubs/services/GroupChat/GroupChatFinder'

describe('group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('update a group chat', async () => {
        mockGroupChatFinder.find.mockResolvedValue(mockGroupChat)

        const service = new GroupChatUpdater(mockGroupChatFinder)
        await service
            .update('123', 'Test', 'description')

        expect(mockGroupChatFinder.find).toBeCalledWith('123')
        expect(mockGroupChat.setSubject).toBeCalledWith('Test')
        expect(mockGroupChat.setDescription).toBeCalledWith('description')
    })
})
