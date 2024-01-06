import { Level } from 'level';
import { wdb } from './layout.ts';
import { DbInterface } from '../db.interface.ts';
import { Buffer } from 'buffer';

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
        await this.db.put(wdb.V, version.toString());
    }

    public async getMasterKey(): Promise<{
        privateKey: Buffer;
        chaincode: Buffer;
    }> {
        const masterKey = await this.db.get(wdb.M);
        const privateKey = Buffer.from(masterKey.slice(0, 64), 'hex');
        const chaincode = Buffer.from(masterKey.slice(64), 'hex');

        return { privateKey, chaincode };
    }

    public async setMasterKey(
        privateKey: Buffer,
        chaincode: Buffer,
    ): Promise<void> {
        await this.db.put(
            wdb.M,
            Buffer.concat([privateKey, chaincode]).toString('hex'),
        );
    }

    public async saveAddress(address: string, path: string): Promise<void> {
        await this.db.sublevel(wdb.A).put(address, path);
    }

    public async getAddress(address: string): Promise<string> {
        return await this.db.sublevel(wdb.A).get(address);
    }

    async hasAddress(address: string): Promise<boolean> {
        return (await this.db.sublevel(wdb.A).get(address)) !== undefined;
    }

    async getReceiveDepth(): Promise<number> {
        return parseInt(await this.db.sublevel(wdb.A).get('receiveDepth'));
    }

    async setReceiveDepth(depth: number): Promise<void> {
        await this.db.sublevel(wdb.A).put('receiveDepth', depth.toString());
    }

    async getChangeDepth(): Promise<number> {
        return parseInt(await this.db.sublevel(wdb.A).get('changeDepth'));
    }

    async setChangeDepth(depth: number): Promise<void> {
        await this.db.sublevel(wdb.A).put('changeDepth', depth.toString());
    }
}
