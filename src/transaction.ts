import { WITNESS_FLAG, WITNESS_MARKER } from './constants.ts';
import { encodingLength, readVarInt } from './utility.ts';
import { Input, Output } from './interface.ts';
import { Buffer } from 'buffer';

export class Transaction {
    version: number;
    inputs: Input[];
    outputs: Output[];
    locktime: number;

    constructor() {
        this.version = 0;
        this.inputs = [];
        this.outputs = [];
        this.locktime = 0;
    }

    static fromBuffer(buffer: Buffer): Transaction {
        const tx = new Transaction();
        let offset = 0;
        tx.version = buffer.readInt32LE(offset);
        offset += 4;

        const hasWitnesses =
            buffer.readUInt8(offset) === WITNESS_MARKER &&
            buffer.readUInt8(offset + 1) === WITNESS_FLAG;
        offset += hasWitnesses ? 2 : 0;

        const vinLen = readVarInt(buffer, offset);
        offset += encodingLength(vinLen);
        for (let i = 0; i < vinLen; i++) {
            const hash = buffer.subarray(offset, offset + 32);
            offset += 32;
            const index = buffer.readUInt32LE(offset);
            offset += 4;
            const scriptSize = readVarInt(buffer, offset);
            offset += encodingLength(scriptSize);
            const script = buffer.subarray(offset, offset + scriptSize);
            offset += scriptSize;
            const sequence = buffer.readUInt32LE(offset);
            offset += 4;
            tx.inputs.push({
                hash: hash,
                index: index,
                script: script,
                sequence: sequence,
                witness: [],
            });
        }

        const voutLen = readVarInt(buffer, offset);
        offset += encodingLength(vinLen);
        for (let i = 0; i < voutLen; i++) {
            const value = buffer.readBigUint64LE(offset);
            offset += 8;
            const scriptSize = readVarInt(buffer, offset);
            offset += encodingLength(scriptSize);
            const script = buffer.subarray(offset, offset + scriptSize);
            offset += scriptSize;
            tx.outputs.push({
                value: Number(BigInt.asUintN(56, value)),
                script: script,
            });
        }

        if (hasWitnesses) {
            for (let i = 0; i < vinLen; i++) {
                const vectorSize = readVarInt(buffer, offset);
                offset += encodingLength(vectorSize);
                const vector: Buffer[] = [];
                for (let j = 0; j < vectorSize; j++) {
                    const witnessItemLen = readVarInt(buffer, offset);
                    offset += encodingLength(witnessItemLen);
                    vector.push(
                        buffer.subarray(offset, offset + witnessItemLen),
                    );
                    offset += witnessItemLen;
                }
                tx.inputs[i].witness = vector;
            }
        }

        tx.locktime = buffer.readUInt32LE(offset);
        offset += 4;

        if (offset !== buffer.length)
            throw new Error('Transaction has unexpected data');

        return tx;
    }

    static fromHex(hex: string): Transaction {
        return Transaction.fromBuffer(Buffer.from(hex, 'hex'));
    }
}
