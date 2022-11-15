import { Message } from "whatsapp-web.js";
import Whatsapp from "../../Libs/Whatsapp";

export default class TextMessageCreator {
    public constructor(
        private whatsapp: Whatsapp,
    ) { }

    public async create(to: string, msg: string): Promise<Message> {
        const messageInstance = await this.whatsapp
            .getClient()
            .sendMessage(to, msg);

        return messageInstance;
    }
}