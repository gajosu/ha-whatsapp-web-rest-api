
const { validationResult } = require('express-validator');
const ws = require("../whatsapp");
const { Location,Buttons,List, MessageMedia } = require('whatsapp-web.js');
let ctr = {};

ctr.sendText = async (req, res) => {

    let validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }

    ws.client.sendMessage(
        req.body.to + '@c.us',
        req.body.msg
    );

    return res.status(200).json({ sucess: 'sended' });
}

ctr.sendMedia = async (req, res) => {

    let validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }

    let media = await MessageMedia.fromUrl(
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

ctr.sendLocation = async (req, res) => {

    let validate = await ctr.validate(req, res);

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

ctr.sendList = async (req, res) => {
    let validate = await ctr.validate(req, res);

    if(validate){
        return validate;
    }
    let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
    let list = new List('List body','btnText',sections,'Title','footer');

    ws.client.sendMessage(
        req.body.to + '@c.us',
        list
    );
}

ctr.validate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}


module.exports = ctr;