import { mockContactFinder, mockContact } from '../../stubs/services/Contact/ContactFinder'
import request from 'supertest'
import testServer from '../../utils/TestWebServer'

const mockContactGetter = {
    all: jest.fn().mockResolvedValue([mockContact])
}

jest.mock('../../../src/Services/Contact/ContactGetter', () => {
    return jest.fn().mockImplementation(() => {
        return mockContactGetter
    })
})

describe('ContactController', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('get all contacts', async () => {
        await request(testServer.app)
            .get('/api/contacts')
            .expect(200, JSON.stringify([mockContact]))

        expect(mockContactGetter.all).toBeCalledTimes(1)
    })

    it('get a contact', async () => {
        mockContactFinder.find = jest.fn().mockResolvedValue(mockContact)

        await request(testServer.app)
            .get('/api/contacts/1')
            .expect(200, JSON.stringify(mockContact))

        expect(mockContactFinder.find).toBeCalledTimes(1)
        expect(mockContactFinder.find).toBeCalledWith('1')
    })

    it('block a contact', async () => {
        mockContactFinder.find = jest.fn().mockResolvedValue(mockContact)

        await request(testServer.app)
            .put('/api/contacts/1/block')
            .expect(204)

        expect(mockContactFinder.find).toBeCalledTimes(1)
        expect(mockContactFinder.find).toBeCalledWith('1')
        expect(mockContact.block).toBeCalledTimes(1)
    })

    it('unblock a contact', async () => {
        mockContactFinder.find = jest.fn().mockResolvedValue(mockContact)

        await request(testServer.app)
            .put('/api/contacts/1/unblock')
            .expect(204)

        expect(mockContactFinder.find).toBeCalledTimes(1)
        expect(mockContactFinder.find).toBeCalledWith('1')
        expect(mockContact.unblock).toBeCalledTimes(1)
    })

    it('get common groups', async () => {
        const mockGroup = {
            id: 1,
            name: 'Group 1',
            description: 'Group 1 description'
        }

        mockContactFinder.find = jest.fn().mockResolvedValue(mockContact)
        mockContact.getCommonGroups.mockResolvedValue([mockGroup])

        await request(testServer.app)
            .get('/api/contacts/1/common-groups')
            .expect(200, [mockGroup])

        expect(mockContactFinder.find).toBeCalledTimes(1)
        expect(mockContactFinder.find).toBeCalledWith('1')
        expect(mockContact.getCommonGroups).toBeCalledTimes(1)
    })
})
