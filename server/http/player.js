const express = require('express');
const playerModel = require("../../model/player");

module.exports = exports = function(options = {}) {
    const router = express.Router();

    router.post("/player", (req, res, next) => {
        playerModel.createPlayer(req.body).then(player => {
            res.status(201).json(player);
        }).catch(err => {
            res.status(500).json(err);
        });
    });

    return router;
};
