import { Transaction } from '../src/core';
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
                        hash: inp.hash.toString('hex'),
                        index: inp.index,
                        script: inp.script.toString('hex'),
                        sequence: inp.sequence,
                        witness: inp.witness.map((w) => w.toString('hex')),
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
                        script: out.script.toString('hex'),
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
});
