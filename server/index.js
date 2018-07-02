const minimist = require("minimist");
const getCombinedWSS = require("./combineWSSExpress");
const args = minimist(process.argv.slice(2), {
    string: ["port"],
    alias: { p: "port" },
    default: { port: process.env.PORT || "8080" },
    "--": true,
});
const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const express = require("express");
const middleware = require("swagger-express-middleware");
const app = express();
const cors = require('cors');
app.use(cors());

var exWSS;
var started = false;
const resolveList = [];

module.exports = exports = new Promise((resolve, reject) => {
    if (exWSS)
        return resolve(exWSS);
    else {
        if (!started) {
            started = true;
            middleware("./swagger.yaml", app, function(err, middleware) {

                if (err) {
                    started = false;
                    return reject(err);
                }

                app.use(middleware.metadata());
                app.use(middleware.parseRequest());
                app.use(middleware.validateRequest());

                // An HTML page to help you produce a validation error
                app.use(function(req, res, next) {
                    res.send(
                        'Click this button to see a validation error:' +
                        '<form action="/pets/Fido" method="post">' +
                        '<button type="submit">POST</button>' +
                        '</form>'
                    );
                });

                // Error handler to display the validation error as HTML
                app.use(function(err, req, res, next) {
                    res.status(err.status);
                    res.send(
                        '<h1>' + err.status + ' Error</h1>' +
                        '<pre>' + err.message + '</pre>'
                    );
                });

                exWSS = new getCombinedWSS(WebSocketServer, express, {
                    port: Number(args.port),
                    app
                });
                require("./http")(exWSS.app); //api-http server
                require("./ws")(exWSS.wss); //web socket server

                resolve(exWSS);
                resolveList.forEach(resolve2 => resolve2(exWSS));
                resolveList.length = 0;

            });
        }
        else {
            resolveList.push(resolve);
        }
        console.log("Server Ready");
    }
});
