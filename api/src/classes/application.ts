import express from "express";
import { Environment } from "../config/public-config";
export class Application {
    private app: express.Application;
    constructor() {
        this.app = express();
        this.startServer();
    }

    private startServer() {
        this.app.listen(Environment.port, () => {
            console.log("Application API active");
        });
    }
}
