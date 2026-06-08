import { Coin } from './coin';
import { Transaction } from 'bitcoinjs-lib';

class CoinPointer {
    effectiveValue: number;
    spendingSize: number;

    constructor(public coin: Coin, feeRate: number) {
        this.spendingSize = coin.estimateSpendingSize();
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
        let target = tx.outs.reduce(
            (acc: number, out: { value: number }) => acc + out.value,
            0,
        );
        target += tx.virtualSize() * this.feeRate;

        const costOfChange = this.costOfChange;
        const changeOutputFee = 31 * this.feeRate; // P2WPKH is 31 B

        const pointers = coins.map(
            (coin) => new CoinPointer(coin, this.feeRate),
        );
        // sort coins by effective value in descending order
        pointers.sort((a, b) => b.effectiveValue - a.effectiveValue);

        let bestSelection: number[] = [];
        let bestWaste = Number.MAX_SAFE_INTEGER;
        let isChange = false;

        // Try Branch and Bound first
        const bnbResult = this.selectBranchAndBound(
            pointers,
            target,
            costOfChange,
        );
        if (bnbResult && bnbResult.length > 0) {
            bestSelection = bnbResult;
            bestWaste = this.getWaste(bnbResult, 0, target, pointers);
        }

        // Add change fee to target for other algorithms
        const targetWithChange = target + changeOutputFee;

        // Lowest Larger
        const llResult = this.selectLowestLarger(pointers, targetWithChange);
        if (llResult.length > 0) {
            const currWaste = this.getWaste(
                llResult,
                costOfChange,
                targetWithChange,
                pointers,
            );
            if (currWaste < bestWaste) {
                bestSelection = llResult;
                bestWaste = currWaste;
                isChange = true;
            }
        }

        // Single Random Draw
        const srdResult = this.selectSingleRandomDraw(
            pointers,
            targetWithChange,
        );
        if (srdResult.length > 0) {
            const currWaste = this.getWaste(
                srdResult,
                costOfChange,
                targetWithChange,
                pointers,
            );
            if (currWaste <= bestWaste) {
                bestSelection = srdResult;
                bestWaste = currWaste;
                isChange = true;
            }
        }

        if (bestSelection.length === 0) {
            throw new Error('Insufficient funds');
        }

        let change = 0;
        if (isChange) {
            change =
                bestSelection.reduce(
                    (acc, index) => acc + pointers[index].effectiveValue,
                    0,
                ) - targetWithChange;

            // Check if change is less than the cost of change
            if (change <= costOfChange) {
                change = 0;
            }
        }

        return {
            coins: bestSelection.map((index) => pointers[index].coin),
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

    private getWaste(
        selected: number[],
        costOfChange: number,
        target: number,
        pointers: CoinPointer[],
    ) {
        let waste = 0;
        let selectedAmount = 0;

        for (const i of selected) {
            const pointer = pointers[i];
            selectedAmount += pointer.effectiveValue;
            waste +=
                (this.feeRate - CoinSelector.LONG_TERM_FEERATE) *
                pointer.spendingSize;
        }

        if (costOfChange > 0) {
            waste += costOfChange;
        } else {
            waste += selectedAmount - target;
        }

        return waste;
    }

    private selectBranchAndBound(
        pointers: CoinPointer[],
        target: number,
        costOfChange: number,
    ) {
        const selected: number[] = [];
        let currValue = 0;
        let remainingValue = 0;
        let index = 0;

        for (const pointer of pointers) {
            remainingValue += pointer.effectiveValue;
        }

        if (remainingValue < target) {
            return [];
        }

        let tries = 100000;
        let bestWaste = Number.MAX_SAFE_INTEGER;
        let bestSelection: number[] = [];

        while (tries-- > 0) {
            let backtrack = false;

            if (
                currValue + remainingValue < target ||
                currValue > target + costOfChange
            ) {
                backtrack = true;
            } else if (currValue >= target) {
                const currWaste = this.getWaste(selected, 0, target, pointers);
                if (currWaste <= bestWaste) {
                    bestSelection = selected.slice();
                    bestWaste = currWaste;
                }
                backtrack = true;
            }

            if (backtrack) {
                if (selected.length === 0) break;

                while (--index > selected[selected.length - 1]) {
                    remainingValue += pointers[index].effectiveValue;
                }

                currValue -= pointers[index].effectiveValue;
                selected.pop();
            } else {
                const pointer = pointers[index];
                remainingValue -= pointer.effectiveValue;

                if (
                    selected.length === 0 ||
                    index - 1 === selected[selected.length - 1] ||
                    pointer.effectiveValue !==
                        pointers[index - 1].effectiveValue
                ) {
                    selected.push(index);
                    currValue += pointer.effectiveValue;
                }
            }
            index++;
        }

        return bestSelection;
    }

    private selectSingleRandomDraw(pointers: CoinPointer[], target: number) {
        const arr = Array.from(pointers.keys());
        arr.sort(() => Math.random() - 0.5);

        let index = 0;
        const selected: number[] = [];
        let selectedValue = 0;

        while (index < arr.length) {
            const pointer = pointers[arr[index]];
            selectedValue += pointer.effectiveValue;
            selected.push(arr[index]);
            if (selectedValue >= target) {
                return selected;
            }
            index++;
        }

        return [];
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
