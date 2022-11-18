import { IWhatsapp } from './../../Libs/Whatsapp'
import { ILogger } from './../../Libs/Logger'
import Express from 'express'

const statusChecker = (
    req: Express.Request,
    res: Express.Response,
    next: any
) => async ({ logger, whatsapp }: { logger: ILogger, whatsapp: IWhatsapp }) => {
    try {
        await whatsapp.getClient().getState().then((state) => {
            if (state === 'CONNECTED') {
                next()
                return
            }

            res.status(503).json({
                message: 'Whatsapp is not connected',
                status: 503
            })

            logger.error('Whatsapp is not connected')
        })
    } catch (error) {
        next(error)
    }
}

export default statusChecker
