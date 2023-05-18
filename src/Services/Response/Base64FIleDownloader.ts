import { Response } from 'express'

export interface IBase64FileDownloader {
    download: (fileName: string, mimetype: string, base64: string, res: Response) => Promise<Response>
}

export default class Base64FileDownloader implements IBase64FileDownloader {
    public async download (fileName: string, mimetype: string, base64: string, res: Response): Promise<Response> {
        const buffer = Buffer.from(base64, 'base64')
        const ext = mimetype.split('/')[1]
        const headers = {
            'Content-Type': mimetype,
            'Content-Disposition': `attachment; filename=${fileName}.${ext}`
        }

        return res
            .set(headers)
            .send(buffer)
    }
}
