import { config } from "./private-config";

export interface IConfig {
    port: string;
}

export class Environment {
    public static readonly port = process.env.PORT || config.port;
}
