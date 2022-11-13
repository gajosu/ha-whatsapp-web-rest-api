
import Logger from './Logger';
import Whatsapp from './Whatsapp';

export default class Controller {

    private logger: Logger = new Logger();
    constructor(
        private whatsapp: Whatsapp
    ) {
    }

    public start() {
        this.logger.info('Starting Controller');
        this.whatsapp.start();
    }
}