import { toOutputScript } from 'bitcoinjs-lib/src/address';
import { Network } from 'bitcoinjs-lib';

type CoinStatus = {
    isConfirmed: boolean;
    blockHeight?: number;
    blockHash?: string;
    blockTime?: number;
};

export class Coin {
    txid: string; // previous transaction id
    vout: number; // index of the output in the previous transaction
    value: number;
    address: string;
    status: CoinStatus;

    constructor(partial: Partial<Coin>) {
        Object.assign(this, partial);
    }

    static fromJSON(json: string): Coin {
        return new Coin(JSON.parse(json));
    }

    toJSON(): string {
        return JSON.stringify({
            txid: this.txid,
            vout: this.vout,
            value: this.value,
            address: this.address,
            status: this.status,
        });
    }

    toInput(network: Network) {
        return {
            hash: this.txid,
            index: this.vout,
            witnessUtxo: {
                script: toOutputScript(this.address, network),
                value: this.value,
            },
        };
    }
}
