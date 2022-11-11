
import { validationResult } from 'express-validator';
import { Request, Response } from "express";
import ws from "../whatsapp";
import { Location,Buttons,List, MessageMedia } from 'whatsapp-web.js';
const ctr = {};

ctr.sendText = async (req : Request, res: Response) => {

    const validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }

    ws.client.sendMessage(
        req.body.to + '@c.us',
        req.body.msg
    );

    return res.status(200).json({ sucess: 'sended' });
}

ctr.sendMedia = async (req : Request, res: Response) => {

    const validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }

    const media = await MessageMedia.fromUrl(
        req.body.url,
        {
            unsafeMime: true
        }
    );

    ws.client.sendMessage(
        req.body.to + '@c.us',
        media
    );

    return res.status(200).json({ sucess: 'sended' });
}

ctr.sendLocation = async (req : Request, res: Response) => {

    const validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }

    ws.client.sendMessage(
        req.body.to + '@c.us',
        // new Buttons('Hola Gabriel Que necesitas',[{body:'Estado de tu order'},{body:'Contactar'},{body:'llamar'}],'title','footer')
        new Location(req.body.latitude, req.body.longitude, req.body.description)
    );

    return res.status(200).json({ sucess: 'sended' });
}

ctr.sendList = async (req : Request, res: Response) => {
    const validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }
    const sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
    const list = new List('List body','btnText',sections,'Title','footer');

    ws.client.sendMessage(
        req.body.to + '@c.us',
        list
    );
}

ctr.validate = async (req : Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}


module.exports = ctr;