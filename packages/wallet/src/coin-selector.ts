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

        const change =
            selected.reduce(
                (acc, index) => acc + pointers[index].effectiveValue,
                0,
            ) - target;

        // TODO: check if change is lower than dust limit, if so add it to fee

        return {
            coins: selected.map((index) => pointers[index].coin),
            change,
        };
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
