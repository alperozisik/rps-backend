const playerList = {}; //For demo purpose it is kept in memory
const uuidv4 = require("uuid/v4");

const symId = Symbol("id");
const symName = Symbol("name");

class Player {
    constructor(name) {
        this[symName] = name;
        this[symId] = uuidv4();
    }

    toString() {
        return this[symName];
    }

    toJSON() {
        let response = {
            name: this[symName],
            id: this[symId]
        };
        // console.info(response);
        return response;
    }

    get name() {
        return this[symName];
    }

    set name(value) {
        return this[symName] = value;
    }

    get id() {
        return this[symId];
    }
}

const createPlayer = props => {
    return new Promise((resolve, reject) => {
        let player = createPlayerSync(props);
        resolve(player);
    });
};

const createPlayerSync = props => {
    let player = new Player(props.name);
    playerList[player.id] = player;
    return player;

};

const findPlayer = (playerId, createNewIfNotFound) => {
    // return new Promise((resolve, reject) => {
    let player = playerList[playerId];
    if (player) {
        // return resolve(player);
        return player;
    }

    else {
        // createPlayer({ name: playerId }).then(newPlayer => {
        // resolve(newPlayer);

        // }, () => {
        // reject();
        // });
        return createPlayerSync({ name: playerId });
    }
    // });
};

Object.assign(exports, {
    Player,
    createPlayer,
    findPlayer
});
