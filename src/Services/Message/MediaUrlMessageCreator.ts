import Whatsapp from "../../Libs/Whatsapp";
import { Message, MessageMedia } from "whatsapp-web.js";

export default class MediaUrlMessageCreator {
    public constructor(
        private whatsapp: Whatsapp,
    ) { }

    public async create(to: string, url: string): Promise<Message> {

        console.log(MessageMedia);
        const message = await MessageMedia.fromUrl(
            url,
            { unsafeMime: true }
        );

        const messageInstance = await this.whatsapp
            .getClient()
            .sendMessage(to, message);

        return messageInstance;
    }
}