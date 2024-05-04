export const testData = [
    {
        description: 'Simple send: two inputs',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '3e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Simple send: two inputs, order reversed',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '033e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Simple send: two inputs from the same transaction',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 3,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0379e71baa2ba3fc66396de3a04f168c7bf24d6870ec88ca877754790c1db357b6',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Simple send: two inputs from the same transaction, order reversed',
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
        outpoint: {
            txid: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
            vout: 3,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '03f4c2da807f89cb1501f1a77322a895acfb93c28e08ed2724d2beb8e44539ba38',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Single recipient: multiple UTXOs from the same public key',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '03548ae55c8eec1e736e8d3e520f011f1f42a56d166116ad210b3937599f87f566',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Single recipient: taproot only inputs with even y-values',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '02de88bea8e7ffc9ce1af30d1132f910323c505185aec8eae361670421e749a1fb',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Single recipient: taproot only with mixed even/odd y-values',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: '1d37787c2b7116ee983e9f9c13269df29091b391c04db94239e0d2bc2182c3bf',
                isXOnly: true,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0377cab7dd12b10259ee82c6ea4b509774e33e7078e7138f568092241bf26b99f1',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Single recipient: taproot input with even y-value and non-taproot input',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0330523cca96b2a9ae3c98beb5e60f7d190ec5bc79b2d11a0b2d4d09a608c448f0',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Single recipient: taproot input with odd y-value and non-taproot input',
        privateKeys: [
            {
                key: '1d37787c2b7116ee983e9f9c13269df29091b391c04db94239e0d2bc2182c3bf',
                isXOnly: true,
            },
            {
                key: '8d4751f6e8a3586880fb66c19ae277969bd5aa06f61c4ee2f1e2486efdf666d3',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '03359358f59ee9e9eec3f00bdf4882570fd5c182e451aa2650b788544aff012a3a',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Multiple outputs: multiple outputs, same recipient',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 2.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 3.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 2.0,
            },
            {
                pubkey: '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca',
                value: 3.0,
            },
        ],
    },
    {
        description: 'Multiple outputs: multiple outputs, multiple recipients',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 2.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 3.0,
            },
            {
                address:
                    'sp1qqgrz6j0lcqnc04vxccydl0kpsj4frfje0ktmgcl2t346hkw30226xqupawdf48k8882j0strrvcmgg2kdawz53a54dd376ngdhak364hzcmynqtn',
                amount: 4.0,
            },
            {
                address:
                    'sp1qqgrz6j0lcqnc04vxccydl0kpsj4frfje0ktmgcl2t346hkw30226xqupawdf48k8882j0strrvcmgg2kdawz53a54dd376ngdhak364hzcmynqtn',
                amount: 5.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 2.0,
            },
            {
                pubkey: '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca',
                value: 3.0,
            },
            {
                pubkey: '03841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8',
                value: 4.0,
            },
            {
                pubkey: '032e847bb01d1b491da512ddd760b8509617ee38057003d6115d00ba562451323a',
                value: 5.0,
            },
        ],
    },
    {
        description: 'Receiving with labels: label with odd parity',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjex54dmqmmv6rw353tsuqhs99ydvadxzrsy9nuvk74epvee55drs734pqq',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '02d014d4860f67d607d60b1af70e0ee236b99658b61bb769832acbbe87c374439a',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Receiving with labels: label with odd parity',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqsg59z2rppn4qlkx0yz9sdltmjv3j8zgcqadjn4ug98m3t6plujsq9qvu5n',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0367626aebb3c4307cf0f6c39ca23247598fabf675ab783292eb2f81ae75ad1f8c',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Receiving with labels: label with odd parity',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgq7c2zfthc6x3a5yecwc52nxa0kfd20xuz08zyrjpfw4l2j257yq6qgnkdh5',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '037efa60ce78ac343df8a013a2027c6c5ef29f9502edcbd769d2c21717fecc5951',
                value: 1.0,
            },
        ],
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqaxww2fnhrx05cghth75n0qcj59e3e2anscr0q9wyknjxtxycg07y3pevyj',
                amount: 2.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 1.0,
            },
            {
                pubkey: '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
                value: 2.0,
            },
        ],
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqaxww2fnhrx05cghth75n0qcj59e3e2anscr0q9wyknjxtxycg07y3pevyj',
                amount: 3.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqaxww2fnhrx05cghth75n0qcj59e3e2anscr0q9wyknjxtxycg07y3pevyj',
                amount: 4.0,
            },
        ],
        expected: [
            {
                pubkey: '0383dc944e61603137294829aed56c74c9b087d80f2c021b98a7fae5799000696c',
                value: 3.0,
            },
            {
                pubkey: '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
                value: 4.0,
            },
        ],
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 5.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqaxww2fnhrx05cghth75n0qcj59e3e2anscr0q9wyknjxtxycg07y3pevyj',
                amount: 6.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjyh2ju7hd5gj57jg5r9lev3pckk4n2shtzaq34467erzzdfajfggty6aa5',
                amount: 7.0,
            },
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjyh2ju7hd5gj57jg5r9lev3pckk4n2shtzaq34467erzzdfajfggty6aa5',
                amount: 8.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 5.0,
            },
            {
                pubkey: '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
                value: 6.0,
            },
            {
                pubkey: '03ae1a780c04237bd577283c3ddb2e499767c3214160d5a6b0767e6b8c278bd701',
                value: 7.0,
            },
            {
                pubkey: '03f4569fc5f69c10f0082cfbb8e072e6266ec55f69fba8cffca4cbb4c144b7e59b',
                value: 8.0,
            },
        ],
    },
    {
        description: 'Single recipient: use silent payments for sender change',
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
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
            {
                address:
                    'sp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqlv6saelkk5snl4wfutyxrchpzzwm8rjp3z6q7apna59z9huq4x754e5atr',
                amount: 2.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 1.0,
            },
            {
                pubkey: '02be368e28979d950245d742891ae6064020ba548c1e2e65a639a8bb0675d95cff',
                value: 2.0,
            },
        ],
    },
    {
        description: 'Single receipient: taproot input with NUMS point',
        privateKeys: [
            {
                key: 'fc8716a97a48ba9a05a98ae47b5cd201a25a7fd5d8b73c203c5f7b6b6b3b6ad7',
                isXOnly: true,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0379e79897c52935bfd97fc6e076a6431a0c7543ca8c31e0fc3cf719bb572c842d',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Pubkey extraction from malleated p2pkh',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
            {
                key: '72b8ae09175ca7977f04993e651d88681ed932dfb92c5158cdf0161dd23fda6e',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '024612cdbf845c66c7511d70aab4d9aed11e49e48cdb8d799d787101cdd0d53e4f',
                value: 1.0,
            },
        ],
    },
    {
        description: 'P2PKH and P2WPKH Uncompressed Keys are skipped',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0367fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Skip invalid P2SH inputs',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0367fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Skip invalid P2SH inputs',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '0367fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6',
                value: 1.0,
            },
        ],
    },
    {
        description: 'Recipient ignores unrelated outputs',
        privateKeys: [
            {
                key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                isXOnly: true,
            },
            {
                key: '0378e95685b74565fa56751b84a32dfd18545d10d691641b8372e32164fad66a',
                isXOnly: false,
            },
        ],
        outpoint: {
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
            vout: 0,
        },
        recipientAddresses: [
            {
                address:
                    'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
                amount: 1.0,
            },
        ],
        expected: [
            {
                pubkey: '03f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
                value: 1.0,
            },
        ],
    },
];
