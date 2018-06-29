const bodyParser = require("body-parser");

module.exports = exports = (app)=> {
    app.use(bodyParser.json());
    app.use(require("./game")());
    app.use(require("./player")());
};