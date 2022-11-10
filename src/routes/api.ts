import express from "express";
import messageCtrl from "../controllers/sendMessage";
import { body, query } from 'express-validator';

const api = express.Router();

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


// default export
module.exports = api;