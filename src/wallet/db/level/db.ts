import { Level } from 'level';
import { wdb } from './layout.ts';
import { DbInterface } from '../db.interface.ts';

export type LevelDBConfigOptions = {
    location: string;
};

export class WalletDB implements DbInterface {
    private readonly db;

    constructor(config: LevelDBConfigOptions) {
        this.db = new Level(config.location, {
            valueEncoding: 'json',
            keyEncoding: 'utf-8',
            createIfMissing: true,
        });
    }

    public async open(): Promise<void> {
        await this.db.open();
    }

    public async close(): Promise<void> {
        await this.db.close();
    }

    public getStatus(): string {
        return this.db.status;
    }

    public async getVersion(): Promise<number> {
        return parseInt(await this.db.get(wdb.V));
    }

    public async setVersion(version: number): Promise<void> {
        this.db.put(wdb.V, version.toString());
    }
}
