/**
 * @typedef {Object} getCombinedWSSResult
 * @prop {WebSocketServer} wss - Object created to handle ws connections
 * @prop {http.Server} server - HTTP Server object created on the way
 * @prop {ExpressApp} app - Provided app value or newly created one
 * 
 * 
 * Creates a combined WebSocketServer with Express Server
 * @param {WebSocketServer} WebSocketServer - class of WebSocketServer
 * @param {express} express - library of express
 * @param {Object|number} options - WSS options or the port number; server value will be replaced
 * @param {ExpressApp} app - (Optional) Previously created express app; If empty one will be created automatically
 * @return {getCombinedWSSResult} - wss and all created artifacts along the way
 */


function getCombinedWSS(WebSocketServer, express, options, app) {
    var http = require("http");
    app = app || express();
    var server = http.createServer(app);
    var port;

    if (typeof options === "number") {
        port = options;
        options = {};
    }
    else {
        port = options.port;
        delete options.port;
    }
   
    server.on("error", function(err) {
        if (global.v8debug) {
            debugger;
        }
        else {
            throw err;
        }
    });
    server.listen(port);
    options.server = server;

    console.info("Server listening on", port);
    var wss = new WebSocketServer(options);

    return {
        wss: wss,
        server: server,
        app: app
    };
}
module.exports = getCombinedWSS;