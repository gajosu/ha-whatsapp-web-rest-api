import winston from 'winston'

export default class Logger {

    private static instance: Logger;
    private logger: winston.Logger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.align(),
                    //show meta data in color
                    winston.format.printf(info => {
                        //pretty winsotn format
                        const {
                            timestamp, level, message, ...args
                        } = info;

                        const ts = timestamp.slice(0, 19).replace('T', ' ');
                        const meta = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
                        //put color on meta json
                        const metaColor = meta ? `\x1b[36m${meta}\x1b[0m` : '';
                        return `${ts} [${level}]: ${message} ${metaColor}`;
                    }),
                )
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }),
        ]
    });


    private constructor() {
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

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