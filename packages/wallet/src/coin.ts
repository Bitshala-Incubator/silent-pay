import { toOutputScript } from 'bitcoinjs-lib/src/address';
import { Network } from 'bitcoinjs-lib';
import { WITNESS_SCALE_FACTOR } from './consensus';
import * as ecc from 'tiny-secp256k1';
import { fromHex, concat } from '@silent-pay/core';

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
    tweak?: string;

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
            tweak: this.tweak,
        });
    }

    toInput(network: Network, spendPubBuffer: Uint8Array) {
        // if tweak present it's a silent payment output
        if (this.tweak) {
            const tweakBuf = fromHex(this.tweak);

            // use x-only pubkey (remove the first byte if it's a compressed pubkey)
            const xOnlyPub = spendPubBuffer.subarray(1, 33);

            // add the tweak to get the tweaked output key
            const result = ecc.xOnlyPointAddTweak(xOnlyPub, tweakBuf);

            return {
                hash: this.txid,
                index: this.vout,
                witnessUtxo: {
                    // Note: bitcoinjs-lib expects Buffer, not Uint8Array
                    // Converting from Uint8Array to Buffer for compatibility
                    script: Buffer.from(
                        concat([
                            new Uint8Array([0x51, 0x20]), // OP_1 + PUSH32 (constructing Taproot script)
                            result.xOnlyPubkey,
                        ]),
                    ),
                    value: this.value,
                },
                // Note: bitcoinjs-lib expects Buffer for tapInternalKey
                tapInternalKey: Buffer.from(xOnlyPub),
            };
        } else {
            // regular P2WPKH handling...
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

    estimateSpendingSize(): number {
        let total = 0;

        // Outpoint (hash and index) + sequence
        total += 32 + 4 + 4;

        // legacy script size (0x00)
        total += 1;

        // check if it's a Taproot address (has a tweak)
        if (this.tweak) {
            let size = 0;

            // varint-items-len
            size += 1;
            // schnorr signature (fixed 64 bytes + 1 byte sighash)
            size += 1 + 65;
            // vsize
            size =
                ((size + WITNESS_SCALE_FACTOR - 1) / WITNESS_SCALE_FACTOR) | 0;

            total += size;
        } else {
            // P2WPKH
            let size = 0;

            // varint-items-len
            size += 1;
            // varint-len [signature]
            size += 1 + 73;
            // varint-len [key]
            size += 1 + 33;
            // vsize
            size =
                ((size + WITNESS_SCALE_FACTOR - 1) / WITNESS_SCALE_FACTOR) | 0;

            total += size;
        }

        return total;
    }

    estimateSpendingFee(feeRate: number): number {
        return this.estimateSpendingSize() * feeRate;
    }
}
