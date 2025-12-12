import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Message, MessageMedia, MessageSendOptions } from 'whatsapp-web.js'
import { promisify } from 'util'
import { pipeline as streamPipeline, Transform } from 'stream'
import { ILogger } from '../../Libs/Logger'
import HttpError from '../../Exceptions/HttpError'
import { IWhatsapp } from '../../Libs/Whatsapp'

const pipeline = promisify(streamPipeline)

const DEFAULT_MAX_CONTENT_LENGTH = Number(process.env.MEDIA_URL_MAX_CONTENT_LENGTH ?? 50 * 1024 * 1024)
const DEFAULT_DOWNLOAD_TIMEOUT = Number(process.env.MEDIA_URL_DOWNLOAD_TIMEOUT ?? 15000)

export interface IMediaUrlMessageCreator {
    create: (to: string, url: string, options?: MessageSendOptions) => Promise < Message >
}

export default class MediaUrlMessageCreator implements IMediaUrlMessageCreator {
    public constructor (
        private readonly whatsapp: IWhatsapp,
        private readonly logger: ILogger
    ) {}

    public async create (to: string, url: string, options?: MessageSendOptions): Promise < Message > {
        let tempFilePath: string | null = null

        try {
            tempFilePath = await this.downloadToTempFile(url)
            const message = MessageMedia.fromFilePath(tempFilePath)
            this.logger.debug(`Downloaded media from ${url} to temporary file ${tempFilePath}`)

            return await this.whatsapp.getClient().sendMessage(to, message, options)
        } catch (err) {
            this.logger.error(`Failed to send media from URL ${url}`, err)

            if (err instanceof HttpError) {
                throw err
            }

            throw new HttpError(502, 'Failed to send media from URL')
        } finally {
            if (tempFilePath !== null) {
                await this.removeTempFile(tempFilePath)
            }
        }
    }

    private async downloadToTempFile (url: string): Promise<string> {
        const response = await this.fetchStream(url)
        this.validateContentLengthHeader(response.headers['content-length'])

        const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'media-url-'))
        const pathname = new URL(url).pathname
        const filename = pathname !== '' ? path.basename(pathname) : 'media'
        const tempFilePath = path.join(tempDir, filename)

        let downloadedBytes = 0

        await pipeline(
            response.data,
            new Transform({
                transform: (chunk: Buffer, encoding, callback) => {
                    downloadedBytes += chunk.length
                    if (downloadedBytes > this.maxContentLength) {
                        callback(new HttpError(413, `Media size exceeds limit of ${this.maxContentLength} bytes`))
                        return
                    }
                    callback(null, chunk)
                }
            }),
            fs.createWriteStream(tempFilePath)
        ).catch((err: Error) => {
            if (err instanceof HttpError) {
                throw err
            }

            throw new HttpError(502, `Unable to write media from ${url}`)
        })

        return tempFilePath
    }

    private async fetchStream (url: string): Promise<AxiosResponse> {
        try {
            return await axios.get(url, {
                responseType: 'stream',
                maxContentLength: this.maxContentLength,
                maxBodyLength: this.maxContentLength,
                timeout: this.downloadTimeout,
                validateStatus: status => status !== undefined && status >= 200 && status < 400
            })
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.code === 'ECONNABORTED') {
                    throw new HttpError(408, `Media download from ${url} timed out after ${this.downloadTimeout}ms`)
                }

                const statusCode = err.response?.status ?? 502
                const message = err.response?.statusText ?? 'Failed to download media'

                throw new HttpError(statusCode, `${message} from ${url}`)
            }

            throw new HttpError(502, `Unexpected error downloading media from ${url}`)
        }
    }

    private validateContentLengthHeader (contentLength?: string): void {
        if (contentLength === undefined) return

        const contentLengthValue = Number(contentLength)
        if (!Number.isNaN(contentLengthValue) && contentLengthValue > this.maxContentLength) {
            throw new HttpError(413, `Media size exceeds limit of ${this.maxContentLength} bytes`)
        }
    }

    private async removeTempFile (tempFilePath: string): Promise<void> {
        try {
            await fs.promises.unlink(tempFilePath)
            await fs.promises.rmdir(path.dirname(tempFilePath)).catch(async () => {
                // Ignore error if directory is not empty or doesn't exist
            })
        } catch (err) {
            this.logger.warn(`Failed to remove temporary file ${tempFilePath}`, err)
        }
    }

    private get maxContentLength (): number {
        return DEFAULT_MAX_CONTENT_LENGTH
    }

    private get downloadTimeout (): number {
        return DEFAULT_DOWNLOAD_TIMEOUT
    }
}
