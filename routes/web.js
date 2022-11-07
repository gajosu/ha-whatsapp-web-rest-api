const express = require("express");
const frontCtrl = require("../controllers/front");

const web = express.Router();

web
    .route("/")
    .get(frontCtrl.index);

module.exports = web;