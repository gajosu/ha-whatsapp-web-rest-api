import axios from 'axios'
import { Readable, PassThrough } from 'stream'
import { mockWhatsappClient, mockMessageMedia } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import mockLogger from '../../stubs/Logger'
import MediaUrlMessageCreator from '../../../src/Services/Message/MediaUrlMessageCreator'

jest.mock('axios')
jest.mock('os', () => ({
    tmpdir: jest.fn(async () => '/tmp')
}))

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs')
    return {
        ...actualFs,
        promises: {
            ...actualFs.promises,
            mkdtemp: jest.fn(async (prefix: string) => await Promise.resolve(`${prefix}test-dir-${Date.now()}`))
        }
    }
})

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
        const data = Buffer.from('data')
        // Create a readable stream that will emit data and close automatically
        const stream = new Readable({
            read () {
                this.push(data)
                this.push(null) // End the stream
            }
        })

        mockedAxios.get.mockResolvedValue({
            data: stream,
            headers: { 'content-length': String(data.length) }
        })

        const creator = new MediaUrlMessageCreator(mockWhatsapp, mockLogger)
        await creator.create('123456789', 'https://www.google.com', { caption: 'test' })

        expect(mockMessageMedia.fromFilePath).toBeCalled()
        expect(mockWhatsappClient.sendMessage).toBeCalledWith('123456789', true, { caption: 'test' })
    })

    it('throws http error when content length header exceeds limit', async () => {
        // Use the same default as the code (50 MB)
        const maxContentLength = Number(process.env.MEDIA_URL_MAX_CONTENT_LENGTH ?? 50 * 1024 * 1024)

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
