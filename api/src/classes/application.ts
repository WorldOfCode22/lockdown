import express from "express";
import mongoose from "mongoose";
import { Environment } from "../config/public-config";
import { ErrorOnlyCallback } from "../interfaces";
export class Application {
    private app: express.Application;
    constructor() {
        console.log("Loading Application");
        this.app = express();
        this.startMongo((error) => {
            if (error) {
                console.log(`Application failed to start: ${error}`);
                process.exit(1);
            }
            this.startServer();
        });
    }

    private startMongo(callback: ErrorOnlyCallback) {
        mongoose.connect(Environment.mongoUri, {useNewUrlParser: true}, (error) => {
            callback(error);
        });
    }

    private startServer() {
        this.app.listen(Environment.port, () => {
            console.log("Application Loaded");
        });
    }
}
