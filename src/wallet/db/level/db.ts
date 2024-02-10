import { Level } from 'level';
import { wdb } from './layout.ts';
import { DbInterface } from '../db.interface.ts';
import { Coin } from '../../coin.ts';

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

    public async getMasterKey() {
        const masterKey = await this.db.get(wdb.M);
        const [encryptedPrivateKey, encryptedChainCode] = masterKey.split(':');

        return { encryptedPrivateKey, encryptedChainCode };
    }

    public async setMasterKey(
        encryptedPrivateKey: string,
        encryptedChainCode: string,
    ): Promise<void> {
        await this.db.put(
            wdb.M,
            `${encryptedPrivateKey}:${encryptedChainCode}`,
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

    async getAllAddresses(): Promise<string[]> {
        return await this.db.sublevel(wdb.A).keys().all();
    }

    async saveUnspentCoins(coins: Coin[]): Promise<void> {
        await this.db.sublevel(wdb.C).put('unspent', JSON.stringify(coins));
    }

    async getUnspentCoins(): Promise<Coin[]> {
        const coins = JSON.parse(await this.db.sublevel(wdb.C).get('unspent'));
        return coins.map((coin: string) => Coin.fromJSON(coin));
    }

    async saveSilentPaymentAddress(address: string): Promise<void> {
        await this.db.put(wdb.SP, address);
    }

    async getSilentPaymentAddress(): Promise<string> {
        try {
            return await this.db.get(wdb.SP);
        } catch (e) {
            if ((e as { code: string }).code === 'LEVEL_NOT_FOUND') {
                return undefined;
            }
            throw e;
        }
    }
}
