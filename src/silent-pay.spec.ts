import HDPrivateKey from 'bcoin/dist/hd/private';
import {
    decodeSilentPaymentAddress,
    deriveSilentPaymentsKeyPair,
    encodeSilentPaymentAddress,
} from './silent-pay';

describe('SilentPay', () => {
    it('should derive scan and spend key from master key', () => {
        const master = HDPrivateKey.generate();
        const { scanKey, spendKey } = deriveSilentPaymentsKeyPair(master);

        expect(scanKey).toStrictEqual(master.derivePath('m/352h/0h/0h/1h/0'));
        expect(spendKey).toStrictEqual(master.derivePath('m/352h/0h/0h/0h/0'));
    });

    it('should fail to derive scan and spend key if master key is not provided', () => {
        const master = HDPrivateKey.generate().derivePath('m/0h/0h');
        expect(() => deriveSilentPaymentsKeyPair(master)).toThrow(
            'Bad master key!',
        );
    });

    describe.each([
        {
            scanKey:
                '03b4cc0b090b6f49a684558852db60ee5eb1c5f74352839c3d18a8fc04ef7354e0',
            spendKey:
                '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
            address:
                'sp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqauj52ymtc4xdkmx3tgyhrsemg2g3303xk2gtzfy8h8ejet8fz8jcw23zua',
        },
        {
            scanKey:
                '03b4cc0b090b6f49a684558852db60ee5eb1c5f74352839c3d18a8fc04ef7354e0',
            spendKey:
                '03ffa54be08548c0eb8d81eca4d8ff18fca4a0eda4fd0a80fb1b663e947dd81d99',
            address:
                'sp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqll5497pp2gcr4cmq0v5nv07x8u5jswmf8ap2q0kxmx8628mkqanyu63ck8',
        },
        {
            scanKey:
                '0220bcfac5b99e04ad1a06ddfb016ee13582609d60b6291e98d01a9bc9a16c96d4',
            spendKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            address:
                'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
        },
    ])('Encode/Decode SP', (data) => {
        it('should encode scan and spend key to silent payment address', () => {
            expect(
                encodeSilentPaymentAddress(
                    Buffer.from(data.scanKey, 'hex'),
                    Buffer.from(data.spendKey, 'hex'),
                    'sp',
                ),
            ).toBe(data.address);
        });

        it('should decode scan and spend key from silent payment address', () => {
            expect(
                decodeSilentPaymentAddress(data.address, 'sp'),
            ).toStrictEqual({
                scanKey: Buffer.from(data.scanKey, 'hex'),
                spendKey: Buffer.from(data.spendKey, 'hex'),
            });
        });
    });
});
