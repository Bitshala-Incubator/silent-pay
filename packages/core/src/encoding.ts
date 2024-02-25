import { bech32m } from 'bech32';
import secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';
import { Network } from 'bitcoinjs-lib';
import { bitcoin } from 'bitcoinjs-lib/src/networks';

export const encodeSilentPaymentAddress = (
    scanKey: Uint8Array,
    spendKey: Uint8Array,
    network: Network = bitcoin,
    version: number = 0,
): string => {
    const data = bech32m.toWords(Buffer.concat([scanKey, spendKey]));
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
    scanKey: Uint8Array,
    spendKey: Uint8Array,
    m: Buffer,
    network: Network = bitcoin,
    version: number = 0,
) => {
    spendKey = secp256k1.publicKeyTweakAdd(spendKey, m, true);
    return encodeSilentPaymentAddress(scanKey, spendKey, network, version);
};

const hrpFromNetwork = (network: Network): string => {
    return network.bech32 === 'bc' ? 'sp' : 'tsp';
};
