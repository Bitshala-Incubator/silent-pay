import { LabelMap } from './interface.ts';
import { Buffer } from 'buffer';
export declare const scanOutputs: (scanPrivateKey: Buffer, spendPublicKey: Buffer, sumOfInputPublicKeys: Buffer, outpointHash: Buffer, outputs: Buffer[], labels?: LabelMap) => Map<string, Buffer>;
