import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import GroupChatCreator from '../../../src/Services/GroupChat/GroupChatCreator'

describe('group chat creator service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('create a group chat', async () => {
        const resp = {
            gid: '123',
            missingParticipants: []
        }

        mockWhatsappClient.createGroup.mockResolvedValue(resp)

        const service = new GroupChatCreator(mockWhatsapp)
        const result = await service
            .create('Test', ['554199999999'])

        expect(mockWhatsappClient.createGroup).toBeCalledWith('Test', ['554199999999'])
        expect(result).toEqual(resp)
    })
})
