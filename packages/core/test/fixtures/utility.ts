export const outpoints = [
    {
        outpoints: [
            {
                txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
                vout: 0,
            },
            {
                txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
                vout: 0,
            },
        ],
        expected:
            '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
    },
    {
        outpoints: [
            {
                txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
                vout: 7,
            },
            {
                txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
                vout: 3,
            },
        ],
        expected:
            '1b85dfe15f0d5e1cedd47bdd70c24ecb0e3401c0a2ace659c422916626b66bce',
    },
    {
        outpoints: [
            {
                txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
                vout: 3,
            },
            {
                txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
                vout: 7,
            },
        ],
        expected:
            'dd7d2a8678cb65b52119af415b578437f5dfc0d9f5bf2daac5e25c21bf0731ce',
    },
];

export const createInputHashData = [
    {
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        expected:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
    },
    {
        sumOfInputPublicKeys:
            '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
        outpoint: {
            txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
            vout: 3,
        },
        expected:
            '402afc065566490b102de1bf599f2f0e045d1379c31945e69ea55f366664a1b1',
    },
];

export const inputPrivateKeys = [
    {
        keys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '93f5ed907ad5b2bdbbdcb5d9116ebc0a4e1f92f910d5260237fa45a9408aad16',
                isXOnly: false,
            },
        ],
        expected:
            '7ed265a6dac7aba8508a32d6d6b84c7f1dbd0a0941dd01088d69e8d556345f86',
    },
    {
        keys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: 'fc8716a97a48ba9a05a98ae47b5cd201a25a7fd5d8b73c203c5f7b6b6b3b6ad7',
                isXOnly: true,
            },
        ],
        expected:
            'e7638ebfda3ab3849a5707e240a6627671f7f6e609bf172691cf1e9780e51d47',
    },
    {
        keys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
        ],
        expected:
            'd5b8f02cbfe3f1d5295af9fb8a9320e859e9cb07115856486ab1a4e4fb89a621',
    },
    {
        keys: [
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: true,
            },
            {
                key: '8d4751f6e8a3586880fb66c19ae277969bd5aa06f61c4ee2f1e2486efdf666d3',
                isXOnly: false,
            },
        ],
        expected:
            '89ce68a062ec130286a4f1a6163f499983814cf61f8aeac76e6f654d98fb9069',
    },
    {
        keys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
        expected:
            'ee55616ce5a93e508f03f21949ecbe70a2a0b107b6e1df5d98b4e4da4adaca1b',
    },
];

export const createTaggedHashData = [
    {
        tag: 'tag',
        hex: '0000000000000000000000000000000000000000000000000000000000000000',
        expected:
            '25a36caa510aee2994cd72a09782258d8621d99a9df9c5d7428ef6a7b026f7bb',
    },
    {
        tag: 'tag',
        hex: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        expected:
            'f5f36a052776e5652c4250f4c49a78415da4c366531839c5d27ba6aafefe3859',
    },
    {
        tag: 'tag',
        hex: '25a36caa510aee2994cd72a09782258d8621d99a9df9c5d7428ef6a7b026f7bbf5f36a052776e5652c4250f4c49a78415da4c366531839c5d27ba6aafefe3859',
        expected:
            'de9cd3236391a236466fbc0d3c79e62503cde0270c6df0c4a7d3d10ca94404e4',
    },
];
