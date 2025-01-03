import { toOutputScript } from 'bitcoinjs-lib/src/address';
import { Network } from 'bitcoinjs-lib';
import { WITNESS_SCALE_FACTOR } from './consensus.ts';

type CoinStatus = {
    isConfirmed: boolean;
    blockHeight?: number;
    blockHash?: string;
    blockTime?: number;
};

type CoinType = 'P2PWKH' | 'P2Silent';

export class Coin {
    txid: string;
    vout: number;
    value: number;
    address: string;
    status: CoinStatus;
    type: CoinType;

    constructor(partial: Partial<Coin>, type: CoinType) {
        Object.assign(this, partial);
        this.type = type;
    }

    static fromJSON(json: string): Coin {
        const data = JSON.parse(json);
        if (data.type === 'P2PWKH') return new P2PWKH(data);
        if (data.type === 'P2TR') return new P2Silent(data);
        throw new Error('Unknown coin type');
    }

    toJSON(): string {
        return JSON.stringify({
            txid: this.txid,
            vout: this.vout,
            value: this.value,
            address: this.address,
            status: this.status,
            type: this.type,
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

    estimateSpendingSize(): number {
        throw new Error("estimateSpendingSize() must be implemented by subclasses");
    }

    estimateSpendingFee(feeRate: number): number {
        return this.estimateSpendingSize() * feeRate;
    }
}

export class P2PWKH extends Coin {
    constructor(partial: Partial<Coin>) {
        super(partial, 'P2PWKH');
    }

    estimateSpendingSize(): number {
        let total = 0;

        // Outpoint (hash and index) + sequence
        total += 32 + 4 + 4;

        // P2WPKH witness size
        let witnessSize = 0;

        // varint-items-len
        witnessSize += 1;
        // varint-len [signature]
        witnessSize += 1 + 73;
        // varint-len [key]
        witnessSize += 1 + 33;

        // Adjust for witness vsize
        witnessSize = ((witnessSize + WITNESS_SCALE_FACTOR - 1) / WITNESS_SCALE_FACTOR) | 0;

        total += witnessSize;
        return total;
    }
}

export class P2Silent extends Coin {
    tweakedData: string;

    constructor(partial: Partial<Coin>  & { tweakedData: string }) {
        super(partial, 'P2Silent');
        this.tweakedData = partial.tweakedData;
    }

    estimateSpendingSize(): number {
        let total = 0;

        // Outpoint (hash and index) + sequence
        total += 32 + 4 + 4;

        // P2TR witness size
        let witnessSize = 0;

        // varint-items-len (P2TR signatures and control block)
        witnessSize += 1;
        // P2TR Schnorr signature (64 bytes)
        witnessSize += 64;
        // Optional script path size if relevant (e.g., 33 bytes for pubkey)
        witnessSize += 33;

        // Adjust for witness vsize
        witnessSize = ((witnessSize + WITNESS_SCALE_FACTOR - 1) / WITNESS_SCALE_FACTOR) | 0;

        total += witnessSize;
        return total;
    }

    toJSON(): string {
        return JSON.stringify({
            txid: this.txid,
            vout: this.vout,
            value: this.value,
            address: this.address,
            status: this.status,
            type: this.type,
            tweakedData: this.tweakedData,
        });
    }

    static fromJSON(json: string): P2Silent {
        const data = JSON.parse(json);
        return new P2Silent({
            ...data,
            tweakedData: data.tweakedData,
        });
    }
}

// Utility functions to determine coin type
export function isP2PWKH(coin: Coin): coin is P2PWKH {
    return coin.type === 'P2PWKH';
}

export function isP2Silent(coin: Coin | Coin[]): coin is P2Silent | P2Silent[] {
    if (Array.isArray(coin)) {
        return coin.every((item) => item.type === 'P2Silent');
    }
    return coin.type === 'P2Silent';
}