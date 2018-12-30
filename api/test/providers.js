const app = require("../build/classes/application");
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { User } = require("../build/models/user-model");
const { Validator } = require("../build/classes/validator");
const { hashSync } = require('bcryptjs');
chai.use(chaiHttp);

describe("/api/providers post", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#",
        providers: []
    }

    before( function(done) {
        application = new app.Application(() => {
            server = application.App
            done();
        });
    });

    beforeEach(function(done) {
        User.deleteMany({}, (err) => {
            if (err) {done(err)}
            User.create({username: newUser.username, hash: newUser.hash}, (err, doc) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("returns 200 and Provider array on valid request", function() {
        const agent = chai.request.agent(server);
        const providerName = "t".repeat(Validator.providerName.max);
        const password = "t".repeat(Validator.providerPassword.max);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.post("/api/providers").send(
                {providerName, password}
            ).then(function(res2) {
                expect(res2).to.have.status(200);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("providers");
                expect(res2.body.providers[0]).to.have.an.property("providerName", providerName);
                expect(res2.body.providers[0]).to.have.an.property("password", password);
                expect(res2.body.providers[0]).to.have.an.property("_id");
            });
        });
    });

    it("returns 400 and validation on providerName to short", function() {
        const agent = chai.request.agent(server);
        const providerName = "t".repeat(Validator.providerName.min - 1);
        const password = "t".repeat(Validator.providerPassword.max);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.post("/api/providers").send(
                {providerName, password}
            ).then(function(res2) {
                expect(res2).to.have.status(400);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("ValidationError");
            });
        });
    });

    it("returns 400 and validation on providerName to long", function() {
        const agent = chai.request.agent(server);
        const providerName = "t".repeat(Validator.providerName.max + 1);
        const password = "t".repeat(Validator.providerPassword.max);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.post("/api/providers").send(
                {providerName, password}
            ).then(function(res2) {
                expect(res2).to.have.status(400);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("ValidationError");
            });
        });
    });

    it("returns 400 and validation on password to short", function() {
        const agent = chai.request.agent(server);
        const providerName = "t".repeat(Validator.providerName.max);
        const password = "t".repeat(Validator.providerPassword.min - 1);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.post("/api/providers").send(
                {providerName, password}
            ).then(function(res2) {
                expect(res2).to.have.status(400);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("ValidationError");
            });
        });
    });

    it("returns 400 and validation on password to long", function() {
        const agent = chai.request.agent(server);
        const providerName = "t".repeat(Validator.providerName.max);
        const password = "t".repeat(Validator.providerPassword.max + 1);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.post("/api/providers").send(
                {providerName, password}
            ).then(function(res2) {
                expect(res2).to.have.status(400);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("ValidationError");
            });
        });
    });

    it("return 401 and authorization error if not logged in", function(done) {
        chai.request(server).post("/api/providers").send(
            {username: newUser.username, password: newUser.password}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res).to.have.status(401);
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.an.property("AuthorizationError");
            done();
        })
    })

    after(function(done) {
        application.Server.close();
        done();
    });
});

describe("/api/providers GET", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#",
        providers: [{providerName: "T", password: "T"}]
    }

    before( function(done) {
        application = new app.Application(() => {
            server = application.App
            done();
        });
    });

    beforeEach(function(done) {
        User.deleteMany({}, (err) => {
            if (err) {done(err)}
            User.create({username: newUser.username, hash: newUser.hash,
                providers: newUser.providers}, (err, doc) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("can return 200 and get providers if user is logged in", function() {
        const agent = chai.request.agent(server);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.get("/api/providers").send().then(function(res2) {
                expect(res2).to.have.status(200);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("providers");
                expect(res2.body.providers[0]).to.have.a.property("providerName", newUser.providers[0].providerName);
                expect(res2.body.providers[0]).to.have.a.property("password", newUser.providers[0].password);
            });
        });
    });

    it("Will return 401 and not a AuthorizationError if user is not logged in", function(done) {
        chai.request(server).get("/api/providers").send().end((err, res) => {
            if(err) {done(err)}
            expect(res).to.have.status(401);
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.an.property("AuthorizationError");
            done();
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});

describe("api/providers DELETE", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#",
        providers: [{providerName: "T", password: "T"}]
    }

    before( function(done) {
        application = new app.Application(() => {
            server = application.App
            done();
        });
    });

    beforeEach(function(done) {
        User.deleteMany({}, (err) => {
            if (err) {done(err)}
            User.create({username: newUser.username, hash: newUser.hash,
                providers: newUser.providers}, (err, doc) => {
                if (err) {done(err)}
                newUser.providers[0] = doc.providers[0];
                done();
            })
        });
    });

    it("will return 200 and deleted provider if user is logged in and id provided", function() {
        const agent = chai.request.agent(server);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.delete("/api/providers").send(
                {id: newUser.providers[0]._id}
            ).then(function(res2) {
                expect(res2).to.have.status(200);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("provider");
                expect(res2.body.provider).to.have.a.property("providerName", newUser.providers[0].providerName);
                expect(res2.body.provider).to.have.a.property("password", newUser.providers[0].password);
            });
        });
    });

    it("will return 400 and ValidationError if invalid id is provided", function() {
        const agent = chai.request.agent(server);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.delete("/api/providers").send(
                {id: '122334455667'}
            ).then(function(res2) {
                expect(res2).to.have.status(400);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("ValidationError");
            });
        });
    });
    
    it("will return 401 and authorization error if user is not logged in", function(done) {
        chai.request(server).delete("/api/providers").send(
            {id: newUser.providers[0]._id}
        ).end((err, res) => {
            if(err) {done(err)}
            expect(res).to.have.status(401);
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.an.property("AuthorizationError");
            done();
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});