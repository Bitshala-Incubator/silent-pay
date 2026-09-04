import { Transaction, toHex } from '../src';
import { validTransactions } from './fixtures/transaction';

describe('Transaction', () => {
    it.each(validTransactions)(
        'should parse a valid transaction - $description',
        (tx) => {
            const transaction = Transaction.fromHex(tx.hex);

            expect(transaction.version).toBe(tx.raw.version);
            expect(transaction.inputs.length).toBe(tx.raw.ins.length);
            expect(
                transaction.inputs
                    .map((inp) => ({
                        hash: toHex(inp.hash),
                        index: inp.index,
                        script: toHex(inp.script),
                        sequence: inp.sequence,
                        witness: inp.witness.map((w) => toHex(w)),
                    }))
                    .sort(
                        (a, b) =>
                            a.hash.localeCompare(b.hash) || a.index - b.index,
                    ),
            ).toStrictEqual(
                tx.raw.ins.sort(
                    (a, b) => a.hash.localeCompare(b.hash) || a.index - b.index,
                ),
            );
            expect(transaction.outputs.length).toBe(tx.raw.outs.length);
            expect(
                transaction.outputs
                    .map((out) => ({
                        script: toHex(out.script),
                        value: out.value,
                    }))
                    .sort(
                        (a, b) =>
                            a.script.localeCompare(b.script) ||
                            a.value - b.value,
                    ),
            ).toStrictEqual(
                tx.raw.outs.sort(
                    (a, b) =>
                        a.script.localeCompare(b.script) || a.value - b.value,
                ),
            );
            expect(transaction.locktime).toBe(tx.raw.locktime);
        },
    );

    const complexTransactions = [
        'P2PK',
        'P2SH P2PK',
        'P2SH P2PKH',
        'P2WSH P2PK',
        'P2WSH P2PKH',
        'P2SH P2WSH P2PKH',
        'P2SH P2WSH P2PK',
        'Standard transaction (14:2)',
        'Multisig',
        'P2WSH Multisig',
        'P2SH P2WSH Multisig',
        'Coinbase transaction w/ witness',
        'P2SH Multisig',
        'Coinbase transaction',
    ];

    it.each(
        validTransactions.filter(
            (tx) => !complexTransactions.includes(tx.description),
        ),
    )('gets the Public Key from Inputs of a $description', (tx) => {
        const transaction = Transaction.fromHex(tx.hex);
        const receivedInPubkeys = tx.raw.ins.map((_, index) => {
            const PK = transaction.getPublicKeyFromInput(index);
            return PK ? toHex(PK) : PK;
        });
        expect(receivedInPubkeys).toStrictEqual(tx.raw.inPubkeys);
    });

    describe('varint offset regression', () => {
        /**
         * Build a minimal non-witness transaction:
         *   4 bytes  version
         *   varint   vinLen
         *   vinLen × (32 hash + 4 index + varint scriptLen=0 + 0 script + 4 seq)
         *   varint   voutLen
         *   voutLen × (8 value + varint scriptLen + script)
         *   4 bytes  locktime
         */
        function buildMinimalTx(
            numInputs: number,
            numOutputs: number,
        ): Uint8Array {
            const parts: number[] = [];

            // version = 1 (little-endian)
            parts.push(0x01, 0x00, 0x00, 0x00);

            // vinLen varint
            pushVarint(parts, numInputs);
            for (let i = 0; i < numInputs; i++) {
                // prev hash (32 bytes of 0xaa)
                for (let j = 0; j < 32; j++) parts.push(0xaa);
                // prev index = i (little-endian u32)
                parts.push(i & 0xff, 0x00, 0x00, 0x00);
                // scriptSig length = 0
                parts.push(0x00);
                // sequence = 0xffffffff
                parts.push(0xff, 0xff, 0xff, 0xff);
            }

            // voutLen varint
            pushVarint(parts, numOutputs);
            for (let i = 0; i < numOutputs; i++) {
                // value = 1000 sats (little-endian u64)
                const val = 1000 + i;
                parts.push(
                    val & 0xff,
                    (val >> 8) & 0xff,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                );
                // scriptPubKey: OP_RETURN (0x6a) — 1 byte script
                parts.push(0x01); // scriptLen = 1
                parts.push(0x6a); // OP_RETURN
            }

            // locktime = 0
            parts.push(0x00, 0x00, 0x00, 0x00);

            return new Uint8Array(parts);
        }

        function pushVarint(arr: number[], n: number) {
            if (n < 0xfd) {
                arr.push(n);
            } else if (n <= 0xffff) {
                arr.push(0xfd, n & 0xff, (n >> 8) & 0xff);
            }
        }

        it('should correctly parse when vinLen and voutLen differ', () => {
            const buf = buildMinimalTx(1, 2);
            const tx = Transaction.fromBuffer(buf);

            expect(tx.inputs).toHaveLength(1);
            expect(tx.outputs).toHaveLength(2);
            expect(tx.outputs[0].value).toBe(1000);
            expect(tx.outputs[1].value).toBe(1001);
        });

        it('should correctly parse when vinLen and voutLen are both > 1', () => {
            const buf = buildMinimalTx(3, 5);
            const tx = Transaction.fromBuffer(buf);

            expect(tx.inputs).toHaveLength(3);
            expect(tx.outputs).toHaveLength(5);
        });
    });
});
