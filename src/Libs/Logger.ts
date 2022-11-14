import winston from 'winston'
import { getLogger } from '../config/Winston';

export default class Logger {
    private logger: winston.Logger;

    public constructor(private category?: string, private color?: string) {
        this.logger = getLogger();
    }

    public info(message: string, ...args: any[]) {
        this.logger.info(this.renderMessage(message), args);
    }

    public error(message: string, ...args: any[]) {
        this.logger.error(this.renderMessage(message), args);
    }

    public warn(message: string, ...args: any[]) {
        this.logger.warn(this.renderMessage(message), args);
    }

    public debug(message: string, ...args: any[]) {
        this.logger.debug(this.renderMessage(message), args);
    }

    private renderMessage(message: string): string {
        const color = this.renderColor();
        if (this.category) {
            return color.replace('%s', `[${this.category}] ${message}`);
        }

        return message;
    }

    private renderColor(): string {
        switch (this.color) {
            case 'red':
                return '\x1b[31m%s\x1b[0m';
            case 'green':
                return '\x1b[32m%s\x1b[0m';
            case 'yellow':
                return '\x1b[33m%s\x1b[0m';
            case 'blue':
                return '\x1b[34m%s\x1b[0m';
            case 'magenta':
                return '\x1b[35m%s\x1b[0m';
            case 'cyan':
                return '\x1b[36m%s\x1b[0m';
            case 'white':
                return '\x1b[37m%s\x1b[0m';
            default:
                return '%s';
        }
    }

}