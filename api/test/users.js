const app = require("../build/classes/application");
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { User } = require("../build/models/user-model");
const { Validator } = require("../build/classes/validator");
const { hashSync } = require('bcryptjs');
chai.use(chaiHttp);

describe("register /api/users post", function() {
    let server;
    let application;

    before( function(done) {
        application = new app.Application(() => {
            server = application.App
            done();
        });
    });

    beforeEach(function(done) {
        User.deleteMany({}, (err) => {
            if (err) {done(err)}
            done();
        })
    });

    it("returns 200 and message on valid registration", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "t".repeat(Validator.username.max - 1), password: "testrtr#R"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(200, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("message");
            done();
        });
    });

    it("returns 400 and ValidationError if username is to short", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.min - 1), password: "testrtr#R"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and ValidationError if username is to long", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.max + 1), password: "testrtr#R"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and ValidationError if password is to short", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.min - 1), password: "testrtr#R"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and ValidationError if password is to long", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.max + 1), password: "testrtr#R"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and ValidationError if password needs more capital letters", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.max), password: "t".repeat(Validator.password.max - 1) + "#"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and ValidationError if password needs more special chars", function(done) {
        chai.request(server).post("/api/users").send(
            {username: "a".repeat(Validator.username.max), password: "t".repeat(Validator.password.max - 1) + "T"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.a("object", "empty body");
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
})

describe("login /api/users/login post", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#"
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
            User.create({username: newUser.username, hash: newUser.hash}, (err) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("returns 200 a message and a cookie on valid input", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(200, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("message");
            expect(res).to.have.header("Set-Cookie");
            done();
        });
    });

    it("returns 400 and a ValidationError if username to short", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: "t".repeat(Validator.username.min - 1), password: newUser.password}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if username to long", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: "t".repeat(Validator.username.max + 1), password: newUser.password}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if password to short", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: "T".repeat(Validator.password.min - 2) + "$"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if password to long", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: "T".repeat(Validator.password.max) + "$"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if password needs more capital letters", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: "t".repeat(Validator.password.max - 1) + "$"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if password needs more special chars", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: "T".repeat(Validator.password.max)}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    it("returns 400 and a ValidationError if username and password mismatch", function(done) {
        chai.request(server).post("/api/users/login").send(
            {username: newUser.username, password: "T".repeat(Validator.password.max - 1) + "$"}
        ).end((err, res) => {
            if (err) {done(err)}
            expect(res.status).to.eql(400, "invalid status code");
            expect(res.body).to.be.an("object", "no body provided")
            expect(res.body).to.have.a.property("ValidationError");
            done();
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});

describe("/api/users get request", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#"
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
            User.create({username: newUser.username, hash: newUser.hash}, (err) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("returns 200 and the user with session cookie present", function() {
        const agent = chai.request.agent(server)
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.get("/api/users").then(
                function(res) {
                    // if (err) {done(err)}
                    expect(res).to.have.status(200, "invalid status");
                    expect(res.body).to.be.an("object", "no body provided")
                    expect(res.body).to.have.property("user");
                    expect(res.body.user).to.have.property("username", newUser.username);
                    agent.close();
            });
        });
    });

    it("returns 401 and an AuthorizationError with session cookie not present", function(done) {
        chai.request(server).get("/api/users").send().end((err, res) => {
            if (err) {done(err)}
            expect(res).to.have.status(401, "invalid status");
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.property("AuthorizationError");
            done();
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});

describe("/api/users delete", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#"
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
            User.create({username: newUser.username, hash: newUser.hash}, (err) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("returns 401 and AuthorizationError if not logged in", function(done) {
        chai.request(server).delete("/api/users").send().end((err, res) => {
            if(err) {done(err)}
            expect(res).to.have.status(401);
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.an.property("AuthorizationError");
            done();
        });
    });

    it("returns 200 and true if user is logged in", function() {
        const agent = chai.request.agent(server);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.delete("/api/users").send().then(function(res2) {
                expect(res2).to.have.status(200);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("deleted", true);
            });
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});

describe("/api/users put", function() {
    let server;
    let application;
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#"
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
            User.create({username: newUser.username, hash: newUser.hash}, (err) => {
                if (err) {done(err)}
                done();
            })
        });
    });

    it("Will return 401 an AuthorizationError if not logged in", function(done) {
        chai.request(server).put("/api/users").send(
            {username: "t".repeat(Validator.username.max), password: "t".repeat(Validator.password.max)}
        ).end((err, res) => {
            if(err) {done(err)}
            expect(res).to.have.status(401);
            expect(res.body).to.be.an("object", "no body provided");
            expect(res.body).to.have.an.property("AuthorizationError");
            done();
        });
    });

    it("Will return 200 and updated user if request is valid", function() {
        const agent = chai.request.agent(server);
        return agent.post("/api/users/login").send(
            {username: newUser.username, password: newUser.password}
        ).then(function(res) {
            expect(res).to.have.cookie("session");

            return agent.put("/api/users").send(
                { username: 'x'.repeat(Validator.username.max), password: 'X'.repeat(Validator.password.max -1) + "!"}
            ).then(function(res2) {
                expect(res2).to.have.status(200);
                expect(res2.body).to.be.an("object", "no body provided");
                expect(res2.body).to.have.an.property("user");
                expect(res2.body.user).to.have.property("username", 'x'.repeat(Validator.username.max));
                expect(res2.body.user).to.have.property("hash");
                expect(res2.body.user.hash).to.not.equal(newUser.hash);
            });
        });
    });

    after(function(done) {
        application.Server.close();
        done();
    });
});
