import { bech32m } from 'bech32';
import secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';
import { Network } from 'bitcoinjs-lib';
import { bitcoin } from 'bitcoinjs-lib/src/networks';
import { createTaggedHash, serialiseUint32 } from './utility';

export const encodeSilentPaymentAddress = (
    scanPubKey: Uint8Array,
    spendPubKey: Uint8Array,
    network: Network = bitcoin,
    version: number = 0,
): string => {
    const data = bech32m.toWords(Buffer.concat([scanPubKey, spendPubKey]));
    data.unshift(version);

    return bech32m.encode(hrpFromNetwork(network), data, 1023);
};

export const decodeSilentPaymentAddress = (
    address: string,
    network: Network = bitcoin,
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

export const createLabeledSilentPaymentAddress = (
    scanPrivKey: Uint8Array,
    spendPubKey: Uint8Array,
    m: number,
    network: Network = bitcoin,
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

const hrpFromNetwork = (network: Network): string => {
    return network.bech32 === 'bc' ? 'sp' : 'tsp';
};
