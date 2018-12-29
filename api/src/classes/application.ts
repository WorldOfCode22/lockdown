import express from "express";
import mongoose from "mongoose";
import { Environment } from "../config/public-config";
import { ErrorOnlyCallback } from "../interfaces";
import bodyParser = require("body-parser");
import { userRouter } from "../routes/users";
import { errorHandler } from "../middleware/errorHandler";
import cookieSession from "cookie-session";
import { Server } from "http";
import { parseSession } from "../middleware/parseSession";
export class Application {
    private app: express.Application;
    private server: Server | null = null;
    constructor(callback?: () => void) {
        console.log("Loading Application");
        this.app = express();
        this.startMongo((error) => {
            if (error) {
                console.log(`Application failed to start: ${error}`);
                process.exit(1);
            }
            this.applyPreRouteMiddleware();
            this.applyRoutes();
            this.postRouteMiddleware();
            this.server = this.startServer();
            if (callback) { callback(); }
        });
    }

    private applyPreRouteMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cookieSession({
            name: "session",
            keys: ["fsfsfsfsf"],
            maxAge: 1000 * 60 * 60 * 8,
        }));
        this.app.use(parseSession);
    }

    private applyRoutes() {
        this.app.use("/api/users", userRouter);
    }

    private postRouteMiddleware() {
        this.app.use(errorHandler);
    }

    private startMongo(callback: ErrorOnlyCallback) {
        mongoose.connect(Environment.mongoUri, {useNewUrlParser: true}, (error) => {
            callback(error);
        });
    }

    private startServer() {
        return this.app.listen(Environment.port, () => {
            console.log("Application Loaded");
        });
    }

    get App() { return this.app; }
    get Server() { return this.server; }
}
