export interface IConfig {
    port: string;
    mongoUri: string;
}

export type ErrorOnlyCallback = (error?: Error) => any;
