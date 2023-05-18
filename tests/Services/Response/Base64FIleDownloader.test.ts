import Base64FileDownloader from '../../../src/Services/Response/Base64FIleDownloader'
import express from 'express'

jest.mock('express')

describe('base 64 file downloader', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get express response', async () => {
        express.response.set = jest.fn().mockReturnValue(express.response)
        express.response.send = jest.fn().mockReturnValue(express.response)

        const base64 = Buffer.from('test').toString('base64')
        const buffer = Buffer.from(base64, 'base64')
        const fileResponse = await new Base64FileDownloader().download('test', 'image/jpg', base64, express.response)

        expect(express.response.set).toBeCalledWith({
            'Content-Type': 'image/jpg',
            'Content-Disposition': 'attachment; filename=test.jpg'
        })

        expect(express.response.send).toBeCalledWith(buffer)
        expect(fileResponse).toEqual(express.response)
    })
})
