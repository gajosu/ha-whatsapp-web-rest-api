import winston from 'winston'
import { getLogger } from '../config/Winston';

export default class Logger {
    private logger: winston.Logger = getLogger();

    public info(message: string, ...args: any[]) {
        this.logger.info(message, args);
    }

    public error(message: string, ...args: any[]) {
        this.logger.error(message, args);
    }

    public warn(message: string, ...args: any[]) {
        this.logger.warn(message, args);
    }

    public debug(message: string, ...args: any[]) {
        this.logger.debug(message, args);

    }
}