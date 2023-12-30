export type DbInterface = {
    getVersion(): Promise<number>;
    setVersion(version: number): Promise<void>;
};
