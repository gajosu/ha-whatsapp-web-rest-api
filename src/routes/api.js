const express = require("express");
const messageCtrl = require("../controllers/sendMessage");
const api = express.Router();
const { body, query } = require('express-validator');

api
    .route("/send/text")
    .post(
        body('to').isNumeric(),
        body('msg').isString(),
        messageCtrl.sendText
    );

api
    .route("/send/media")
    .post(
        body('to').isNumeric(),
        body('url').isURL(),
        messageCtrl.sendMedia
    );

api
    .route("/send/location")
    .post(
        body('to').isNumeric(),
        body('latitude').isNumeric(),
        body('longitude').isNumeric(),
        body('description').isString(),
        messageCtrl.sendLocation
    );

api
    .route("/send/list")
    .post(
        body('to').isNumeric(),
        messageCtrl.sendList
    );


module.exports = api;