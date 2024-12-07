import { payments } from 'bitcoinjs-lib';

export function deriveAddressFromPubKey(pubKey: string): string {
    const pubKeyBuffer = Buffer.from(pubKey, 'hex');

    if (pubKeyBuffer.length === 32) {
        // P2TR (Taproot)
        try {
            const { address } = payments.p2tr({
                internalPubkey: pubKeyBuffer,
            });
            if (address) return address;
        } catch (error) {
            console.error('Failed to derive P2TR address:', error);
        }
    } else if (
        pubKeyBuffer.length === 33 &&
        (pubKeyBuffer[0] === 0x02 || pubKeyBuffer[0] === 0x03)
    ) {
        // P2WPKH (Native SegWit)
        try {
            const { address } = payments.p2wpkh({ pubkey: pubKeyBuffer });
            if (address) return address;
        } catch (error) {
            console.error('Failed to derive P2WPKH address:', error);
        }

        // P2SH-P2WPKH (Wrapped SegWit)
        try {
            const p2wpkh = payments.p2wpkh({ pubkey: pubKeyBuffer });
            const { address } = payments.p2sh({ redeem: p2wpkh });
            if (address) return address;
        } catch (error) {
            console.error('Failed to derive P2SH-P2WPKH address:', error);
        }
    } else if (
        (pubKeyBuffer.length === 33 &&
            (pubKeyBuffer[0] === 0x02 || pubKeyBuffer[0] === 0x03)) ||
        (pubKeyBuffer.length === 65 && pubKeyBuffer[0] === 0x04)
    ) {
        // P2PKH (Legacy)
        try {
            const { address } = payments.p2pkh({ pubkey: pubKeyBuffer });
            if (address) return address;
        } catch (error) {
            console.error('Failed to derive P2PKH address:', error);
        }
    }

    throw new Error('Unsupported public key format or address type.');
}
