import winston from 'winston'
import { getLogger } from '../config/Winston'
import { formatError } from "pretty-print-error"

export interface ILogger {
    getCategoryLogger: (category: string, color: string) => ILogger
    info: (message: string, ...meta: any[]) => void
    error: (message: string, ...meta: any[]) => void
    warn: (message: string, ...meta: any[]) => void
    debug: (message: string, ...meta: any[]) => void
}

export default class Logger implements ILogger {
    private readonly logger: winston.Logger

    public constructor (private readonly category?: string, private readonly color?: string) {
        this.logger = getLogger()
    }

    public getCategoryLogger (category: string, color?: string): ILogger {
        return new Logger(category, color)
    }

    public info (message: string, ...meta: any[]): void {
        this.logger.info(this.renderMessage(message), meta)
    }

    public error (message: string, ...meta: any[]): void {
        if (meta[0] instanceof Error) {
            this.logger.error(this.renderMessage(message + '\n' + formatError(meta[0])))
        } else {
            this.logger.error(this.renderMessage(message), meta)
        }
    }

    public warn (message: string, ...meta: any[]): void {
        this.logger.warn(this.renderMessage(message), meta)
    }

    public debug (message: string, ...meta: any[]): void {
        this.logger.debug(this.renderMessage(message), meta)
    }

    private renderMessage (message: string): string {
        const color = this.renderColor()
        if (this.category !== undefined) {
            return color.replace('%s', `[${this.category}] ${message}`)
        }

        return message
    }

    private renderColor (): string {
        switch (this.color) {
            case 'red':
                return '\x1b[31m%s\x1b[0m'
            case 'green':
                return '\x1b[32m%s\x1b[0m'
            case 'yellow':
                return '\x1b[33m%s\x1b[0m'
            case 'blue':
                return '\x1b[34m%s\x1b[0m'
            case 'magenta':
                return '\x1b[35m%s\x1b[0m'
            case 'cyan':
                return '\x1b[36m%s\x1b[0m'
            case 'white':
                return '\x1b[37m%s\x1b[0m'
            default:
                return '%s'
        }
    }
}
