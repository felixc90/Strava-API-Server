const express = require('express')
const router  = express.Router();

const controller = require('./controller.js');

router.get("/register/:guildId/:userId/:username", controller.register);

module.exports = router