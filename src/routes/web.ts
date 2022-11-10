import express from "express";
import frontCtrl from "../controllers/front";

const web = express.Router();

web
    .route("/")
    .get(frontCtrl.index);

module.exports = web;