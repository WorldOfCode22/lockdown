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
    let newUser = {
        username: "t".repeat(Validator.username.max),
        hash: hashSync("T".repeat(Validator.password.max -1 ) + "#"),
        password: "T".repeat(Validator.password.max -1 ) + "#"
    }

    before( function(done) {
        const Application = new app.Application(() => {
            server = Application.App
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
});
