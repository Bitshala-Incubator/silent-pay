import { Transaction, fromHex, toHex } from '../src';

describe('Transaction output public keys & edge cases', () => {
    describe('getPublicKeyFromOutput', () => {
        it('extracts public key from a Taproot (P2TR) output', () => {
            const tx = new Transaction();
            const taprootKey = fromHex(
                'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
            );
            const script = new Uint8Array(34);
            script[0] = 0x51; // OP_1
            script[1] = 0x20; // PUSHBYTES_32
            script.set(taprootKey, 2);

            tx.outputs.push({
                value: 50000,
                script,
            });

            const extracted = tx.getPublicKeyFromOutput(0);
            expect(extracted).not.toBeNull();
            expect(toHex(extracted!)).toBe(toHex(taprootKey));
        });

        it('extracts uncompressed public key from a P2PK output', () => {
            const tx = new Transaction();
            const uncompressedKey = new Uint8Array(65);
            uncompressedKey[0] = 0x04;
            for (let i = 1; i < 65; i++) {
                uncompressedKey[i] = i & 0xff;
            }

            const script = new Uint8Array(67);
            script[0] = 0x41; // PUSHBYTES_65
            script.set(uncompressedKey, 1);
            script[66] = 0xac; // OP_CHECKSIG

            tx.outputs.push({
                value: 100000,
                script,
            });

            const extracted = tx.getPublicKeyFromOutput(0);
            expect(extracted).not.toBeNull();
            expect(toHex(extracted!)).toBe(toHex(uncompressedKey));
        });

        it('extracts compressed public key from a P2PK output', () => {
            const tx = new Transaction();
            const compressedKey = fromHex(
                '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
            );

            const script = new Uint8Array(35);
            script[0] = 0x21; // PUSHBYTES_33
            script.set(compressedKey, 1);
            script[34] = 0xac; // OP_CHECKSIG

            tx.outputs.push({
                value: 75000,
                script,
            });

            const extracted = tx.getPublicKeyFromOutput(0);
            expect(extracted).not.toBeNull();
            expect(toHex(extracted!)).toBe(toHex(compressedKey));
        });

        it('returns null for standard P2PKH script', () => {
            const tx = new Transaction();
            // OP_DUP OP_HASH160 20-byte-hash OP_EQUALVERIFY OP_CHECKSIG
            const script = fromHex(
                '76a91489abcdefabbaabbaabbaabbaabbaabbaabbaabba88ac',
            );
            tx.outputs.push({ value: 10000, script });

            expect(tx.getPublicKeyFromOutput(0)).toBeNull();
        });

        it('returns null for P2WPKH script', () => {
            const tx = new Transaction();
            // OP_0 20-byte-hash
            const script = fromHex(
                '001489abcdefabbaabbaabbaabbaabbaabbaabbaabba',
            );
            tx.outputs.push({ value: 10000, script });

            expect(tx.getPublicKeyFromOutput(0)).toBeNull();
        });

        it('returns null for OP_RETURN script', () => {
            const tx = new Transaction();
            const script = fromHex('6a100102030405060708090a0b0c0d0e0f10');
            tx.outputs.push({ value: 0, script });

            expect(tx.getPublicKeyFromOutput(0)).toBeNull();
        });
    });

    describe('Transaction hex and buffer parsing error cases', () => {
        it('throws an error when fromHex is called with an empty string', () => {
            expect(() => Transaction.fromHex('')).toThrow(
                'Invalid transaction hex: empty string',
            );
        });

        it('throws an error when fromHex receives invalid or odd length hex', () => {
            expect(() => Transaction.fromHex('abcde')).toThrow(
                /Invalid hex string|Invalid transaction hex/i,
            );
        });

        it('throws an error when fromBuffer receives unexpected trailing data', () => {
            // Minimal valid 1-input, 1-output tx:
            // version: 01000000 (4 bytes)
            // vinCount: 01 (1 byte)
            // input: 32 bytes txid, 4 bytes vout (00000000), 1 byte scriptLen (00), 4 bytes seq (ffffffff)
            // voutCount: 01 (1 byte)
            // output: 8 bytes value (00e1f50500000000), 1 byte scriptLen (00)
            // locktime: 00000000 (4 bytes)
            // + trailing extra byte: 'ff'
            const baseHex =
                '01000000' +
                '01' +
                '0000000000000000000000000000000000000000000000000000000000000000' +
                '00000000' +
                '00' +
                'ffffffff' +
                '01' +
                '00e1f50500000000' +
                '00' +
                '00000000';

            const validTxBuffer = fromHex(baseHex);
            const parsed = Transaction.fromBuffer(validTxBuffer);
            expect(parsed.version).toBe(1);

            const bufferWithTrailing = fromHex(baseHex + 'ff');
            expect(() => Transaction.fromBuffer(bufferWithTrailing)).toThrow(
                'Transaction has unexpected data',
            );
        });
    });
});
