const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);


describe("HTTP Server", () => {

    describe("Player", () => {
        it("it should create a new player", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                chai.request(server)
                    .post("/player")
                    .send({
                        name: "Alper"
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.id.should.be.a("string");
                        res.body.name.should.be.a("string");
                        done();
                    });
            });
        });
    });



    describe("Game", () => {

        it("it should GET all the games", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                chai.request(server)
                    .get("/game")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("array");
                        res.body.length.should.be.eql(0);
                        done();
                    });
            });
        });

        it("it should create a new game", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                chai.request(server)
                    .post("/game")
                    .send({
                        owner: "Alper",
                        gameType: "RPS",
                        maximumNumberOfPlayers: 2
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        let game = res.body;
                        game.id.should.be.a("string");
                        game.owner.should.be.an("object");
                        game.owner.id.should.be.a("string");
                        game.owner.name.should.be.a("string").that.is.equal("Alper");
                        game.gameType.should.be.a("string").that.is.equal("RPS");
                        game.maximumNumberOfPlayers.should.be.a("number").that.is.equal(2);
                        game.state.should.be.a("string").that.is.equal("waiting");

                        done();
                    });
            });
        });

        let gameId;

        it("should get a game after creation", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                chai.request(server)
                    .get("/game")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("array");
                        res.body.length.should.be.eql(1);

                        let game = res.body[0];
                        game.id.should.be.a("string");
                        game.owner.should.be.an("object");
                        game.owner.id.should.be.a("string");
                        game.owner.name.should.be.a("string").that.is.equal("Alper");
                        game.gameType.should.be.a("string").that.is.equal("RPS");
                        game.maximumNumberOfPlayers.should.be.a("number").that.is.equal(2);
                        game.state.should.be.a("string").that.is.equal("waiting")

                        gameId = game.id;

                        done();
                    });
            });
        });


        it("it should create another game", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                chai.request(server)
                    .post("/game")
                    .send({
                        owner: "alper2",
                        gameType: "RPSSL",
                        maximumNumberOfPlayers: 5
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        let game = res.body;
                        game.id.should.be.a("string");
                        game.owner.should.be.an("object");
                        game.owner.id.should.be.a("string");
                        game.owner.name.should.be.a("string").that.is.equal("alper2");
                        game.gameType.should.be.a("string").that.is.equal("RPSSL");
                        game.maximumNumberOfPlayers.should.be.a("number").that.is.equal(5);
                        game.state.should.be.a("string").that.is.equal("waiting");

                        done();
                    });
            });
        });


        it("should filter a game by id", (done) => {
            require("../server").then((exWSS) => {
                let server = exWSS.app;
                let reqPath = `/game?id=${gameId}`;
                chai.request(server)
                    .get(reqPath)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("array");
                        res.body.length.should.be.eql(1);

                        let game = res.body[0];
                        game.id.should.be.a("string");
                        game.owner.should.be.an("object");
                        game.owner.id.should.be.a("string");
                        game.owner.name.should.be.a("string").that.is.equal("Alper");
                        game.gameType.should.be.a("string").that.is.equal("RPS");
                        game.maximumNumberOfPlayers.should.be.a("number").that.is.equal(2);
                        game.state.should.be.a("string").that.is.equal("waiting")

                        done();
                    });
            });
        });

    });

});
