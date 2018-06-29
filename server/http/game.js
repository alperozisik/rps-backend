const express = require('express');
const gameModel = require("../../model/game");

module.exports = exports = function(options = {}) {
    const router = express.Router();

    router.get("/game", (req, res, next) => {
        gameModel.getGames({ id: req.query.id }).then(games => {
            res.json(games);
        }).catch(err => {
            res.status(500).json(err);
        });
    });

    router.post("/game", (req, res, next) => {
        gameModel.prepare(req.body).then(game => {
            res.status(201).json(game);
        }).catch(err => {
            res.status(500).json(err);
        });
    });


    return router;
};
