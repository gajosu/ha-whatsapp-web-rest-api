import {Message} from "whatsapp-web.js";
import {IWhatsapp} from "../../Libs/Whatsapp";

export interface ITextMessageCreator {
    create(to : string, msg : string): Promise < Message >;
}
export default class TextMessageCreator implements ITextMessageCreator {
    public constructor(private whatsapp : IWhatsapp,) {}

    public async create(to : string, msg : string): Promise < Message > {
        const messageInstance = await this.whatsapp.getClient().sendMessage(to, msg);

        return messageInstance;
    }
}
