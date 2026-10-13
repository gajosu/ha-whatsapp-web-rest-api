import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import GroupChatCreator from '../../../src/Services/GroupChat/GroupChatCreator'
import HttpError from '../../../src/Exceptions/HttpError'

describe('group chat creator service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        delete (mockWhatsappClient as any).pupPage
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

    it('loads the lazy group create bundle before creating the group', async () => {
        const evaluate = jest.fn().mockResolvedValue(undefined);
        (mockWhatsappClient as any).pupPage = { evaluate }
        mockWhatsappClient.createGroup.mockResolvedValue({ gid: '123' })

        const service = new GroupChatCreator(mockWhatsapp)
        await service.create('Test', ['554199999999'])

        expect(evaluate).toBeCalledTimes(1)
        expect(evaluate.mock.calls[0][0]).toContain('WAWebNewGroupFlowLoadable')
        expect(evaluate.mock.invocationCallOrder[0]).toBeLessThan(mockWhatsappClient.createGroup.mock.invocationCallOrder[0])
    })

    it('throws an http error when whatsapp returns an error string', async () => {
        mockWhatsappClient.createGroup.mockResolvedValue('CreateGroupError: An unknown error occupied while creating a group')

        const service = new GroupChatCreator(mockWhatsapp)
        const promise = service.create('Test', ['554199999999'])

        await expect(promise).rejects.toBeInstanceOf(HttpError)
        await expect(promise).rejects.toMatchObject({ status: 502 })
    })
})
