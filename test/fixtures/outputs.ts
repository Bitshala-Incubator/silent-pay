export const testData = [
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '93f5ed907ad5b2bdbbdcb5d9116ebc0a4e1f92f910d5260237fa45a9408aad16',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '93f5ed907ad5b2bdbbdcb5d9116ebc0a4e1f92f910d5260237fa45a9408aad16',
                isXOnly: false,
            },
        ],
        outpoints: [
            {
                txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
                vout: 0,
            },
            {
                txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
                vout: 0,
            },
        ],
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '93f5ed907ad5b2bdbbdcb5d9116ebc0a4e1f92f910d5260237fa45a9408aad16',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '03162f2298705b3ddca01ce1d214eedff439df3927582938d08e29e464908db00b',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '93f5ed907ad5b2bdbbdcb5d9116ebc0a4e1f92f910d5260237fa45a9408aad16',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '02d9ede52f7e1e64e36ccf895ca0250daad96b174987079c903519b17852b21a3f',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '020aafdcdb5893ae813299b16eea75f34ec16653ac39171da04d7c4e6d2e09ab8e',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: 'fc8716a97a48ba9a05a98ae47b5cd201a25a7fd5d8b73c203c5f7b6b6b3b6ad7',
                isXOnly: true,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: true,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: '8d4751f6e8a3586880fb66c19ae277969bd5aa06f61c4ee2f1e2486efdf666d3',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '032b4ff8e5bc608cbdd12117171e7d265b6882ad597559caf67b5ecfaf15301dd0',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: true,
            },
            {
                key: '8d4751f6e8a3586880fb66c19ae277969bd5aa06f61c4ee2f1e2486efdf666d3',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '0275f501f319db549aaa613717bd7af44da566d4d859b67fe436946564fafc47a3',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.2,
            },
        ],
        expected: [
            {
                pubkey: '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                value: 0.1,
            },
            {
                pubkey: '030a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09',
                value: 0.2,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.2,
            },
            {
                address:
                    'sp1qqgrz6j0lcqnc04vxccydl0kpsj4frfje0ktmgcl2t346hkw30226xqupawdf48k8882j0strrvcmgg2kdawz53a54dd376ngdhak364hzcmynqtn',
                amount: 0.3,
            },
            {
                address:
                    'sp1qqgrz6j0lcqnc04vxccydl0kpsj4frfje0ktmgcl2t346hkw30226xqupawdf48k8882j0strrvcmgg2kdawz53a54dd376ngdhak364hzcmynqtn',
                amount: 0.4,
            },
        ],
        expected: [
            {
                pubkey: '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                value: 0.1,
            },
            {
                pubkey: '030a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09',
                value: 0.2,
            },
            {
                pubkey: '02c58e121044b23cba9b4695052229a9fd9e044b579f92864eb886ae7c99b021c9',
                value: 0.3,
            },
            {
                pubkey: '034b15b75f3f184328c4a2f7c79357481ed06cf3b6f95512d5ed946fdc0b60d62b',
                value: 0.4,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqhmem6grvs4nacsu0v5v5mjs934j7qfgkdkj8c95gyuru3tjpulvcwky2dz',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '022cbceeab2a4982841eb7dc34b8b4f19c04bf3bc083ebf984f5664366778eb50f',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqc389f45lq7jyqt8jxq6fkskfukr2tlruf6w8cpcx2krntwe4fr9ykagp3j',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '036b4455de119f51bf4d4a12dea555f14a5dc2c1369af5fba4871c5367264c028d',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgq4umqa5feskydh9xadc9jlc22c89tu0apcv72u2vkuwtsrgzf0uesq45zq9',
                amount: 0.1,
            },
        ],
        expected: [
            {
                pubkey: '03c3473bfcbe5e4d20d0790ae91f1b339bc15b46de64ca068d140118d0e325b849',
                value: 0.1,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqah4hxfsjdwyaeel4g8x2npkj7qlvf2692l5760z5ut0ggnlrhdzsy3cvsj',
                amount: 0.2,
            },
        ],
        expected: [
            {
                pubkey: '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                value: 0.1,
            },
            {
                pubkey: '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
                value: 0.2,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqah4hxfsjdwyaeel4g8x2npkj7qlvf2692l5760z5ut0ggnlrhdzsy3cvsj',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqah4hxfsjdwyaeel4g8x2npkj7qlvf2692l5760z5ut0ggnlrhdzsy3cvsj',
                amount: 0.2,
            },
        ],
        expected: [
            {
                pubkey: '038890c19f005d6f6add5fef92d37ac6b161b7fdd5c1aef6eed1d32be3f216ac4c',
                value: 0.1,
            },
            {
                pubkey: '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
                value: 0.2,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqah4hxfsjdwyaeel4g8x2npkj7qlvf2692l5760z5ut0ggnlrhdzsy3cvsj',
                amount: 0.2,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgq562yg7htxyg8eq60rl37uul37jy62apnf5ru62uef0eajpdfrnp5cmqndj',
                amount: 0.3,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgq562yg7htxyg8eq60rl37uul37jy62apnf5ru62uef0eajpdfrnp5cmqndj',
                amount: 0.4,
            },
        ],
        expected: [
            {
                pubkey: '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                value: 0.1,
            },
            {
                pubkey: '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
                value: 0.2,
            },
            {
                pubkey: '031b90a42136fef9ff2ca192abffc7be4536dc83d4e61cf18ae078f7e92b297cce',
                value: 0.3,
            },
            {
                pubkey: '0287a82600c08a255bc97d172e10816e322967eed6a77c9f37dd926492d7fdc106',
                value: 0.4,
            },
        ],
    },
    {
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
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
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 0.1,
            },
            {
                address:
                    'sp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqll5497pp2gcr4cmq0v5nv07x8u5jswmf8ap2q0kxmx8628mkqanyu63ck8',
                amount: 0.2,
            },
        ],
        expected: [
            {
                pubkey: '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                value: 0.1,
            },
            {
                pubkey: '020050c52a32566c0dfb517e473c68fedce4bd4543d219348d3bbdceeeb5755e34',
                value: 0.2,
            },
        ],
    },
];
