const playerModel = require("../player");
const symOwner = Symbol("owner");
const symPlayerList = Symbol("playerList");
const symMaxPlayerCount = Symbol("maxPlayerCount");
const symGameType = Symbol("GameType");
const symGameId = Symbol("gameId");
const symGameState = Symbol("gameState");
const symGameLogic = Symbol("gameLogic");
const gameList = []; //For demo purpose it is kept in memory
const rps = require("rps-common");
const uuidv4 = require("uuid/v4");
const GameState = require("./gameState");

class Game {
    constructor(props) {
        let owner = playerModel.findPlayer(props.owner, true);
        this[symOwner] = owner;
        this[symPlayerList] = [owner];
        this[symMaxPlayerCount] = props.maximumNumberOfPlayers;
        this[symGameType] = props.gameType;
        this[symGameId] = uuidv4();
        this[symGameState] = GameState.WAITING;
        this[symGameLogic] = null;
    }

    get id() {
        return this[symGameId];
    }

    get owner() {
        return this[symOwner];
    }

    get players() {
        return this[symPlayerList].slice(0);
    }

    get maximumNumberOfPlayers() {
        return this[symMaxPlayerCount];
    }

    get gameState() {
        return this[symGameState];
    }

    get gameType() {
        return this[symGameType];
    }

    get gameLogic() {
        return this[symGameLogic];
    }

    addPlayer(player) {
        return new Promise((resolve, reject) => {
            player = playerModel.findPlayer(player.id || player, true);
            let playerList = this[symPlayerList];
            if (playerList.includes(player)) {
                return reject({
                    message: "Player is already in the game",
                    playerCount: playerList.length
                });
            }
            if (this[symMaxPlayerCount] === playerList.length) {
                return reject({
                    message: "Reached maximum player count",
                    playerCount: playerList.length
                });
            }
            playerList.push(player);
            resolve({
                message: "Player added successfully",
                playerCount: playerList.length
            });
        });
    }

    toJSON() {
        let response = {
            owner: this.owner,
            gameType: this.gameType,
            maximumNumberOfPlayers: this.maximumNumberOfPlayers,
            state: this.gameState,
            id: this[symGameId]
        };
        // console.info(response);
        return response;
    }

    start() {
        let theGame = this;
        return new Promise((resolve, reject) => {
            if (theGame[symGameState] === GameState.WAITING) {
                if (theGame.players.length < 2) {
                    return reject({ message: "Not enough players. Should be at least 2" });
                }
                theGame[symGameState] = GameState.STARTED;
                let playerList = [];
                theGame.players.forEach(p => playerList.push(new rps.Player(p.name)));
                theGame[symGameLogic] = new rps.Game(rps.GameType[theGame.gameType], ...playerList);
                resolve(theGame[symGameLogic]);
            }
            else
                reject({ message: "Game already started" });
        });
    }

    stop() {
        this[symGameState] = GameState.FINISHED;
        this[symGameLogic] = null;
    }
}

const getGames = (filter = {}) => {
    return new Promise((resolve, reject) => {
        resolve(gameList.filter((item, index, array) => {
            if (!filter.gameState && item.gameState === GameState.FINISHED) {
                return false; //do not list finished games if state filter is not set
            }
            for (let k in filter) {
                if(typeof filter[k] === "undefined")
                    continue;
                if (!(item[k] === filter[k] || filter[k] === (item[k] && item[k].id))) {
                    return false;
                }
            }
            return true;
        }));
    });
};

const prepare = (props) => {
    return new Promise((resolve, reject) => {
        let game = new Game({
            owner: props.owner,
            gameType: props.gameType || "RPS",
            maximumNumberOfPlayers: props.maximumNumberOfPlayers || 2
        });
        gameList.push(game);
        resolve(game);
    });
};



Object.assign(exports, {
    Game,
    getGames,
    prepare
});
