import { Coin } from './coin.ts';
import { Transaction } from 'bitcoinjs-lib';

class CoinPointer {
    effectiveValue: number;

    constructor(public coin: Coin, feeRate: number) {
        this.effectiveValue = coin.value - coin.estimateSpendingFee(feeRate);
    }
}

export class CoinSelector {
    private readonly feeRate: number = 1;
    public static readonly LONG_TERM_FEERATE: number = 5; // in sats/vB
    constructor(feeRate?: number) {
        this.feeRate = feeRate;
    }

    select(
        coins: Coin[],
        tx: Transaction,
    ): {
        coins: Coin[];
        change: number;
    } {
        let target = tx.outs.reduce((acc, out) => acc + out.value, 0);
        target += tx.virtualSize() * this.feeRate;

        const changeOutputFee = 31 * this.feeRate; // P2WPKH is 31 B
        target += changeOutputFee;

        const pointers = coins.map(
            (coin) => new CoinPointer(coin, this.feeRate),
        );
        // sort coins by effective value in descending order
        pointers.sort((a, b) => b.effectiveValue - a.effectiveValue);

        const selected = this.selectCoins(pointers, target);

        let change =
            selected.reduce(
                (acc, index) => acc + pointers[index].effectiveValue,
                0,
            ) - target;

        // Calculate the cost of change
        const costOfChange = this.costOfChange;

        // Check if change is less than the cost of change
        if (change <= costOfChange) {
            change = 0;
        }

        return {
            coins: selected.map((index) => pointers[index].coin),
            change,
        };
    }

    get costOfChange() {
        // P2WPKH output size in bytes:
        // Pay-to-Witness-Public-Key-Hash (P2WPKH) outputs have a fixed size of 31 bytes:
        // - 8 bytes to encode the value
        // - 1 byte variable-length integer encoding the locking script’s size
        // - 22 byte locking script
        const outputSize = 31;

        // P2WPKH input size estimation:
        // - Composition:
        //   - PREVOUT: hash (32 bytes), index (4 bytes)
        //   - SCRIPTSIG: length (1 byte), scriptsig for P2WPKH input is empty
        //   - sequence (4 bytes)
        //   - WITNESS STACK:
        //     - item count (1 byte)
        //     - signature length (1 byte)
        //     - signature (71 or 72 bytes)
        //     - pubkey length (1 byte)
        //     - pubkey (33 bytes)
        // - Total:
        //   32 + 4 + 1 + 4 + (1 + 1 + 72 + 1 + 33) / 4 = 68 vbytes
        const inputSizeOfChangeUTXO = 68;

        const costOfChangeOutput = outputSize * this.feeRate;
        const costOfSpendingChange =
            inputSizeOfChangeUTXO * CoinSelector.LONG_TERM_FEERATE;

        return costOfChangeOutput + costOfSpendingChange;
    }

    private selectCoins(pointers: CoinPointer[], target: number) {
        const selected = this.selectLowestLarger(pointers, target);
        if (selected.length > 0) return selected;

        // if we are here it means that target is greater than the sum of all coins we have
        throw new Error('Insufficient funds');
    }

    private selectLowestLarger(pointers: CoinPointer[], amount: number) {
        let index = 0;
        const selected = [];
        let effectiveValue = pointers[index].effectiveValue;

        // while target is greater than the largest coin we have, we will keep selecting the largest coin
        while (amount >= effectiveValue) {
            // update target, select current coin and increment index
            selected.push(index);
            amount -= effectiveValue;
            index++;

            if (index === pointers.length) break;

            effectiveValue = pointers[index].effectiveValue;
        }

        if (amount > 0 && index !== pointers.length) {
            // now we are sure that target < the largest unselected coin we will perform Binary search to find the smallest coin which is greater than target value
            const lowestLargerIndex = this.findLowestLarger(
                pointers,
                amount,
                index,
            );
            amount -= pointers[lowestLargerIndex].effectiveValue;
            selected.push(lowestLargerIndex);
        }

        return amount > 0 ? [] : selected;
    }

    private findLowestLarger(
        pointers: CoinPointer[],
        amount: number,
        index: number,
    ) {
        let i = index;
        let j = pointers.length - 1;

        // begin binary search
        let lowestLargerIndex = 0;
        let mid = 0;
        while (i <= j) {
            mid = Math.floor((i + j) / 2);

            // calculate effective value of coin at mid
            const effectiveValue = pointers[mid].effectiveValue;

            // if target is less than coin at mid
            // then search in right part of array
            if (amount <= effectiveValue) {
                lowestLargerIndex = mid;
                // repeat for right half
                i = mid + 1;
            } else {
                // repeat for left half
                j = mid - 1;
            }
        }

        return lowestLargerIndex;
    }
}
