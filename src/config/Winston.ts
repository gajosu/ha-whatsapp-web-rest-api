import winston from 'winston'

export function getLogger (): winston.Logger {
    return winston.createLogger({
        level: process.env.LOG_LEVEL ?? 'info',
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.align(),
                    // show meta data in color
                    winston.format.printf(info => {
                        // pretty winsotn format
                        const {
                            timestamp, level, message, ...args
                        } = info

                        const ts = new Date(timestamp as string).toLocaleDateString(undefined, {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: false
                        })

                        const meta = (Object.keys(args).length > 0) ? JSON.stringify(args, null, 2) : ''
                        // put color on meta json
                        const metaColor = meta !== '' ? `\x1b[36m${meta}\x1b[0m` : ''
                        return `${ts} [${level}]: ${message} ${metaColor}`
                    })
                )
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    })
}
