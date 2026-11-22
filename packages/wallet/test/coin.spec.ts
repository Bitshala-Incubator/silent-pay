import { Coin } from '../src/coin';
import { networks } from 'bitcoinjs-lib';
import { fromHex, toHex } from '@silent-pay/core';

describe('Coin', () => {
    const sampleTxid =
        '1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809';
    const sampleAddress = 'bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx';
    const sampleValue = 50000;

    describe('JSON serialization & deserialization', () => {
        it('serializes to JSON and recovers full Coin structure via fromJSON', () => {
            const coin = new Coin({
                txid: sampleTxid,
                vout: 1,
                value: sampleValue,
                address: sampleAddress,
                status: {
                    isConfirmed: true,
                    blockHeight: 800000,
                    blockHash: '00000000000000000001',
                    blockTime: 1700000000,
                },
                tweak: '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
            });

            const json = coin.toJSON();
            const restored = Coin.fromJSON(json);

            expect(restored.txid).toBe(coin.txid);
            expect(restored.vout).toBe(coin.vout);
            expect(restored.value).toBe(coin.value);
            expect(restored.address).toBe(coin.address);
            expect(restored.tweak).toBe(coin.tweak);
            expect(restored.status.isConfirmed).toBe(true);
            expect(restored.status.blockHeight).toBe(800000);
        });
    });

    describe('estimateSpendingSize', () => {
        it('estimates spending size for a standard P2WPKH input', () => {
            const coin = new Coin({
                txid: sampleTxid,
                vout: 0,
                value: sampleValue,
                address: sampleAddress,
            });

            // outpoint(40) + scriptLen(1) + vsize(ceil(110/4) = 28) = 69
            const estimated = coin.estimateSpendingSize();
            expect(estimated).toBe(69);
        });

        it('estimates spending size for a Taproot silent payment tweaked input', () => {
            const coin = new Coin({
                txid: sampleTxid,
                vout: 0,
                value: sampleValue,
                address: sampleAddress,
                tweak: '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
            });

            // outpoint(40) + scriptLen(1) + vsize(1 + 66 = 67 witness bytes => ceil(67/4) = 17) = 58
            const estimated = coin.estimateSpendingSize();
            expect(estimated).toBe(58);
        });
    });

    describe('toInput', () => {
        // Known compressed spend public key (33 bytes)
        const spendPubKey = fromHex(
            '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
        );

        it('creates a standard P2WPKH input when tweak is not present', () => {
            const coin = new Coin({
                txid: sampleTxid,
                vout: 0,
                value: sampleValue,
                address: sampleAddress,
            });

            const input = coin.toInput(networks.regtest, spendPubKey);
            expect(input.hash).toBe(sampleTxid);
            expect(input.index).toBe(0);
            expect(input.witnessUtxo.value).toBe(sampleValue);
            // P2WPKH script: 00 14 <20 bytes>
            expect(input.witnessUtxo.script[0]).toBe(0x00);
            expect(input.witnessUtxo.script[1]).toBe(0x14);
            expect(input.tapInternalKey).toBeUndefined();
        });

        it('creates a tweaked Taproot input when tweak is present', () => {
            const tweak =
                '1111111111111111111111111111111111111111111111111111111111111111';
            const coin = new Coin({
                txid: sampleTxid,
                vout: 2,
                value: 75000,
                address: sampleAddress,
                tweak,
            });

            const input = coin.toInput(networks.regtest, spendPubKey);
            expect(input.hash).toBe(sampleTxid);
            expect(input.index).toBe(2);
            expect(input.witnessUtxo.value).toBe(75000);

            // Taproot script: OP_1 (0x51) + PUSH32 (0x20) + 32-byte tweaked pubkey = 34 bytes
            expect(input.witnessUtxo.script.length).toBe(34);
            expect(input.witnessUtxo.script[0]).toBe(0x51);
            expect(input.witnessUtxo.script[1]).toBe(0x20);

            // tapInternalKey must equal the 32-byte x-only pubkey (spendPubKey without leading byte)
            expect(input.tapInternalKey).toBeDefined();
            expect(toHex(new Uint8Array(input.tapInternalKey!))).toBe(
                toHex(spendPubKey.subarray(1, 33)),
            );
        });
    });
});
