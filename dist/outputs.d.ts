import { Outpoint, Output, PrivateKey, RecipientAddress } from './interface.ts';
export declare const createOutputs: (inputPrivateKeys: PrivateKey[], outpoints: Outpoint[], recipientAddresses: RecipientAddress[], hrp?: string) => Output[];
