This module is standalone to run the backend, multiplayer services for the Rock Paper Scissors game

# Installation
To use in a **node** project
```shell
npm i -S https://github.com/alperozisik/rps-backend --production
```

# Start Server
```shell
node index.js
```
When is ready, it will log `Server Ready`

## Start parameters
- `-p` OR `--port` &rarr; (Optional) TCP port value for hosting


## Port
This backend server uses single port for hosting HTTP API and WebSocket API. In order to determine the port number, the lookup is in the following order:
1. command argument: `-p` OR `--port`
2. `PORT` environment variable
3. 8080

# Service API Documentation
HTTP Service APIs are defined with Swagger. It is available on [SwaggerHub](https://app.swaggerhub.com/apis/alperozisik/rps/1.0)

# Usage Flow
1. User gets a player id from POST /player
2. List of available games are listed: GET /game
3. User may create a game for other players to join POST /game
    - User may filter with ?id=`gameId` query string
4. Rest of the flow (joining, playing, ending the game) occurs on web sockets