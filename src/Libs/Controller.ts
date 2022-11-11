
import Logger from '../config/Logger';
import Whatsapp from './Whatsapp';

export default class Controller {

    private logger: Logger = Logger.getInstance();
    constructor(
        private whatsapp: Whatsapp
    ) {
    }

    public start() {
        this.logger.warn('Starting Controller');
        this.whatsapp.start();
    }
}