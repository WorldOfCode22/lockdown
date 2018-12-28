import { config } from "./private-config";

export class Environment {
    public static readonly port = process.env.PORT || config.port;
    public static readonly mongoUri = process.env.MONGO_URI || config.mongoUri;
}
