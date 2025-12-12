import axios from 'axios'
import { PassThrough } from 'stream'
import { mockWhatsappClient, mockMessageMedia } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import mockLogger from '../../stubs/Logger'
import MediaUrlMessageCreator from '../../../src/Services/Message/MediaUrlMessageCreator'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock isAxiosError as a type guard function
Object.defineProperty(mockedAxios, 'isAxiosError', {
    value: (error: any): error is import('axios').AxiosError => {
        return error?.isAxiosError === true
    },
    writable: true,
    configurable: true
})

describe('Media url message creator', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('downloads media stream and sends message', async () => {
        const stream = new PassThrough()
        mockedAxios.get.mockResolvedValue({
            data: stream,
            headers: { 'content-length': '4' }
        })

        const creator = new MediaUrlMessageCreator(mockWhatsapp, mockLogger)
        const createPromise = creator.create('123456789', 'https://www.google.com', { caption: 'test' })

        stream.end(Buffer.from('data'))

        await createPromise

        expect(mockMessageMedia.fromFilePath).toBeCalled()
        expect(mockWhatsappClient.sendMessage).toBeCalledWith('123456789', true, { caption: 'test' })
    })

    it('throws http error when content length header exceeds limit', async () => {
        const maxContentLength = Number(process.env.MEDIA_URL_MAX_CONTENT_LENGTH ?? 10 * 1024 * 1024)

        mockedAxios.get.mockResolvedValue({
            data: new PassThrough(),
            headers: { 'content-length': String(maxContentLength + 1) }
        })

        const creator = new MediaUrlMessageCreator(mockWhatsapp, mockLogger)

        await expect(creator.create('123456789', 'https://www.google.com'))
            .rejects.toMatchObject({ status: 413, message: `Media size exceeds limit of ${maxContentLength} bytes` })
    })

    it('translates axios timeout into http error', async () => {
        mockedAxios.get.mockRejectedValue({ isAxiosError: true, code: 'ECONNABORTED' })

        const creator = new MediaUrlMessageCreator(mockWhatsapp, mockLogger)

        await expect(creator.create('123456789', 'https://www.google.com'))
            .rejects.toMatchObject({ status: 408, message: 'Media download from https://www.google.com timed out after 15000ms' })
    })
})
