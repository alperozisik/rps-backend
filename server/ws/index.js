const gameModel = require("../../model/game");
const playerModel = require("../../model/player");
const socketsGame = new WeakMap();
const socketPlayer = new WeakMap();
const gameRounds = new WeakMap();
const WebSocket = require('ws');

module.exports = exports = (wss) => {
    wss.on('connection', function connection(ws) {

        ws.send2 = function(message) {
            if (ws.readyState !== WebSocket.OPEN)
                return;
            if (typeof message === "object")
                message = JSON.stringify(message);
            ws.send(message);
        };

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            message = JSON.parse(message);
            actions[message.type] && actions[message.type](message, ws);
        });


        ws.on('close', function close() {
            var game = getGame(ws);
            game.sockets.forEach(s => {
                if (s === ws)
                    return;
                s.send2({
                    type: "endGame"
                });
            });
            game.stop();
            game.sockets.length = 0;
        });
    });


};

const actions = {
    joinGame: (message, ws) => {
        let player = playerModel.findPlayer(message.player);
        let addSocket = (game) => {
            game.sockets.set(player, ws);
        };

        gameModel.getGames({ id: message.game }).then((gameList) => {
            let game = gameList[0];
            if (!game)
                return;
            if (game.owner.id !== player.id) {
                game.addPlayer(player).then(result => {
                    addSocket(game);
                    ws.send2(
                        Object.assign({
                            type: "joinGameResponse",
                            success: true,
                        }, result));
                    notifyPlayersAboutJoinedPlayer(game, player);
                    associateSocketWithGameAndPlayer(ws, game, player);
                }, result => {
                    ws.send2(
                        Object.assign({
                            type: "joinGameResponse",
                            success: false
                        }, result));
                });
            }
            else {
                addSocket(game);
                associateSocketWithGameAndPlayer(ws, game, player);
                ws.send2({
                    type: "joinGameResponse",
                    success: true,
                    playerCount: game.players.length,
                    message: "Joined as owner"
                });
            }
        });
    },
    getPlayerList: (message, ws) => {
        let game = getGame(ws);
        ws.send2({
            players: game.players,
            type: "getPlayerListResponse"
        });
    },
    playerReady: (message, ws) => {
        let game = getGame(ws);
        let player = getPlayer(ws);
        game.setPlayerReady(player);
        if (game.areAllPayersReady()) {
            game.sockets.forEach(s => {
                s.send2({
                    type: "gameReady",
                    players: game.players,
                    gameType: game.gameType
                });
            });
        }
    },
    userPlays: (message, ws) => {
        let game = getGame(ws);
        let player = getPlayer(ws);

        let round = gameRounds.get(game);
        if (!round) {
            round = new Map();
            gameRounds.set(game, round);
        }
        round.set(player, message.userPlays);
        if (round.size === game.players.length) {
            let msg = JSON.stringify({
                type: "recieveRound",
                round: Array.from(round)
            });
            round = new Map();
            gameRounds.set(game, round);
            game.sockets.forEach(s => s.send(msg));
        }
    }
};


function notifyPlayersAboutJoinedPlayer(game, joinedPlayer) {
    var sockets = game.sockets;

    for (let [player, socket] of sockets) {
        if (player.id === joinedPlayer.id)
            continue;
        socket.send2({
            type: "playerJoined",
            playerCount: game.players.length,
            newPlayerName: joinedPlayer.name,
            maximumNumberOfPlayers: game.maximumNumberOfPlayers
        });
    }
}

function associateSocketWithGameAndPlayer(ws, game, player) {
    socketsGame.set(ws, game);
    socketPlayer.set(ws, player);
}

function getGame(ws) {
    return socketsGame.get(ws);
}

function getPlayer(ws) {
    return socketPlayer.get(ws);
}
