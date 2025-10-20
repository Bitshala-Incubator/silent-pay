import { bech32m } from 'bech32';
import secp256k1 from 'secp256k1';
import { concat, toHex } from '../../../helpers/uint8array.js';
import { Network } from 'bitcoinjs-lib';
import {
    createTaggedHash,
    encodingLength,
    readVarInt,
    serialiseUint32,
} from './utility';
import { SilentBlock } from './interface';
import { bitcoin } from './networks';

export const encodeSilentPaymentAddress = (
    scanPubKey: Uint8Array,
    spendPubKey: Uint8Array,
    network: Network = bitcoin,
    version: number = 0,
): string => {
    const data = bech32m.toWords(concat([scanPubKey, spendPubKey]));
    data.unshift(version);

    return bech32m.encode(hrpFromNetwork(network), data, 1023);
};

export const decodeSilentPaymentAddress = (
    address: string,
    network: Network = bitcoin,
): { scanKey: Uint8Array; spendKey: Uint8Array } => {
    const { prefix, words } = bech32m.decode(address, 1023);
    if (prefix != hrpFromNetwork(network)) throw new Error('Invalid prefix!');

    const version = words.shift();
    if (version != 0) throw new Error('Invalid version!');

    const key = new Uint8Array(bech32m.fromWords(words));

    return {
        scanKey: key.slice(0, 33),
        spendKey: key.slice(33),
    };
};

export const createLabeledSilentPaymentAddress = (
    scanPrivKey: Uint8Array,
    spendPubKey: Uint8Array,
    m: number,
    network: Network = bitcoin,
    version: number = 0,
) => {
    const label = createTaggedHash(
        'BIP0352/Label',
        concat([scanPrivKey, serialiseUint32(m)]),
    );
    const scanPubKey = secp256k1.publicKeyCreate(scanPrivKey);
    const tweakedSpendPubKey = secp256k1.publicKeyTweakAdd(
        spendPubKey,
        label,
        true,
    );
    return encodeSilentPaymentAddress(
        scanPubKey,
        tweakedSpendPubKey,
        network,
        version,
    );
};

const hrpFromNetwork = (network: Network): string => {
    return network.bech32 === 'bc' ? 'sp' : 'tsp';
};

export const parseSilentBlock = (data: Uint8Array): SilentBlock => {
    const view = new DataView(data.buffer, data.byteOffset);
    const type = data[0];
    const transactions = [];
    let cursor = 1;
    const count = readVarInt(data, cursor);
    cursor += encodingLength(count);

    for (let i = 0; i < count; i++) {
        const txid = toHex(data.subarray(cursor, cursor + 32));
        cursor += 32;

        const outputs = [];
        const outputCount = readVarInt(data, cursor);
        cursor += encodingLength(outputCount);

        for (let j = 0; j < outputCount; j++) {
            const value = Number(view.getBigUint64(cursor, false)); // big-endian
            cursor += 8;

            const pubKey = toHex(data.subarray(cursor, cursor + 32));
            cursor += 32;

            const vout = view.getUint32(cursor, false); // big-endian
            cursor += 4;

            outputs.push({ value, pubKey, vout });
        }

        const scanTweak = toHex(data.subarray(cursor, cursor + 33));
        cursor += 33;

        transactions.push({ txid, outputs, scanTweak });
    }

    return { type, transactions };
};
