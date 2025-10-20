import { Coin } from '../src/coin';
import { CoinSelector } from '../src/coin-selector';
import { Transaction } from 'bitcoinjs-lib';
import crypto from 'crypto';

describe('CoinSelector', () => {
    let coinSelector: CoinSelector;
    const feeRate: number = 5;

    beforeAll(() => {
        coinSelector = new CoinSelector(feeRate);
    });

    it('should generate the correct cost of change', () => {
        // Fixed value for the cost of change based on the current feeRate.
        const correctCostOfChange = 495;

        // Assert the correctness of the CoinSelector result.
        expect(correctCostOfChange).toBe(coinSelector.costOfChange);
    });

    it.each([
        {
            description: 'add change to the fee if it is dust',
            testCoinValues: [
                1005, 9040, 6440, 2340, 7540, 3920, 5705, 9030, 1092, 5009,
            ],
            // Fixed transaction output value that ensures the cost of change is dust.
            // txOutValue = totalBalance - transactionFees - coinSelector.costOfChange + 1;
            // transactionFees = (virtualSize + changeOutputSize) * feeRate, P2WPKH output is 31 bytes.
            txOutValue: 46707,
            expectedChange: 0, // Change will be zero when less than dust.
        },
        {
            description: 'create change output if change is greater than dust',
            testCoinValues: [4000],
            txOutValue: 1000, // Less output so that the change is greater than dust.
            expectedChange: 2185, // expectedChange = totalSelectedCoin - (txOutValue + transactionFees).
        },
    ])(
        'should $description',
        ({ txOutValue, testCoinValues, expectedChange }) => {
            const coins: Coin[] = [];

            // Create coins based on the fixed array of coin values.
            testCoinValues.forEach((value: number) => {
                const coin = new Coin({ value });
                coins.push(coin);
            });

            // Create a new Transaction
            const transaction: Transaction = new Transaction();

            // Set the transaction output value with a random output script.
            // Random 20 bytes and `0014${randomBytes.toString()}` will be a valid P2WPKH script.
            transaction.addOutput(
                Buffer.from(
                    `0014${crypto.randomBytes(20).toString('hex')}`,
                    'hex',
                ), // Ensure the first parameter passed to addOutput is a Buffer.
                txOutValue,
            );

            // Select coins and change using the CoinSelector.
            const { coins: selectedCoins, change } = coinSelector.select(
                coins,
                transaction,
            );

            // Assert that the selected coins' size equals all available coins.
            expect(selectedCoins.length).toBe(testCoinValues.length);
            // Assert the change against the expected change condition.
            expect(change).toBe(expectedChange);
        },
    );
});
