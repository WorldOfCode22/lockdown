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