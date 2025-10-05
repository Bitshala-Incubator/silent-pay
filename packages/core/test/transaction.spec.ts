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
});
