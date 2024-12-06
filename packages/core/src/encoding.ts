import { bech32m } from 'bech32'; // Import the Bech32 library for encoding and decoding addresses
import secp256k1 from 'secp256k1'; // Import the Secp256k1 library for cryptographic operations
import { Buffer } from 'buffer'; // Import the Buffer library for handling binary data
import { Network } from 'bitcoinjs-lib'; // Import the BitcoinJS library for working with Bitcoin networks and addresses
import { bitcoin } from 'bitcoinjs-lib/src/networks'; // Import the default Bitcoin network settings
import {
    createTaggedHash,
    encodingLength,
    readVarInt,
    serialiseUint32,
} from './utility'; // Import utility functions for creating and parsing silent payment addresses
import { SilentBlock } from './interface'; // Import the interface for handling silent payment blocks

// Export a function to encode a silent payment address using the provided scan and spend public keys, as well as the specified version and network settings
export const encodeSilentPaymentAddress = (
    scanPubKey: Uint8Array,
    spendPubKey: Uint8Array,
    network: Network = bitcoin, // Set the default network to Bitcoin if not provided
    version: number = 0,
): string => {
    const data = bech32m.toWords(Buffer.concat([scanPubKey, spendPubKey]));
    data.unshift(version);

    return bech32m.encode(hrpFromNetwork(network), data, 1023);
};

// Export a function to decode a silent payment address using the provided network settings
export const decodeSilentPaymentAddress = (
    address: string,
    network: Network = bitcoin, // Set the default network to Bitcoin if not provided
): { scanKey: Buffer; spendKey: Buffer } => {
    const { prefix, words } = bech32m.decode(address, 1023);
    if (prefix != hrpFromNetwork(network)) throw new Error('Invalid prefix!');

    const version = words.shift();
    if (version != 0) throw new Error('Invalid version!');

    const key = Buffer.from(bech32m.fromWords(words));

    return {
        scanKey: key.slice(0, 33),
        spendKey: key.slice(33),
    };
};

// Export a function to create a labeled silent payment address using the provided scan private key, spend public key, m value, version, and network settings
export const createLabeledSilentPaymentAddress = (
    scanPrivKey: Uint8Array,
    spendPubKey: Uint8Array,
    m: number,
    network: Network = bitcoin, // Set the default network to Bitcoin if not provided
    version: number = 0,
) => {
    const label = createTaggedHash(
        'BIP0352/Label',
        Buffer.concat([scanPrivKey, serialiseUint32(m)]),
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

// Define a helper function to determine the prefix for a given Bitcoin network based on its Bech32 encoding settings
const hrpFromNetwork = (network: Network): string => {
    return network.bech32 === 'bc' ? 'sp' : 'tsp';
};

// Export a function to parse a silent payment block from the provided data buffer using utility functions
export const parseSilentBlock = (data: Buffer): SilentBlock => {
    const type = data.readUInt8(0);
    const transactions = [];
    let cursor = 1;
    const count = readVarInt(data, cursor);
    cursor += encodingLength(count);

    for (let i = 0; i < count; i++) {
        const txid = data.subarray(cursor, cursor + 32).toString('hex');
        cursor += 32;

        const outputs = [];
        const outputCount = readVarInt(data, cursor);
        cursor += encodingLength(outputCount);

        for (let j = 0; j < outputCount; j++) {
            const value = Number(data.readBigUInt64BE(cursor));
            cursor += 8;

            const pubKey = data.subarray(cursor, cursor + 32).toString('hex');
            cursor += 32;

            const vout = data.readUint32BE(cursor);
            cursor += 4;

            outputs.push({ value, pubKey, vout });
        }

        const scanTweak = data.subarray(cursor, cursor + 33).toString('hex');
        cursor += 33;

        transactions.push({ txid, outputs, scanTweak });
    }

    return { type, transactions };
};
