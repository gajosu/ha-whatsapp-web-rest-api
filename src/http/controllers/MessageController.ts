import { Request, Response } from "express-serve-static-core";
import { validationResult } from 'express-validator';
import MediaUrlMessageCreator from "../../Services/Message/MediaUrlMessageCreator";
import TextMessageCreator from "../../Services/Message/TextMessageCreator";

export default class MessageController {
    public constructor(
        private textMessageCreator: TextMessageCreator,
        private mediaUrlMessageCreator: MediaUrlMessageCreator,
    ) { }

    public async store(request: Request, response: Response): Promise<Response> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        const { to, msg, url } = request.body;

        try{
            if (url) {
                await this.mediaUrlMessageCreator.create(to, url);
            } else {
                await this.textMessageCreator.create(to, msg);
            }
        } catch (error) {
            return response.status(422).json({ error: error.message });
        }

        return response.json({ message: 'Message sent' });
    }
}
