export const testData = [
    {
        description: 'Simple send: two inputs',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
        inputHash:
            '5bfe5321d759e01a2ac9292f0f396ff9c3d8b58d89ccb21a6922e84bb7ad0668',
        outputs: [
            '023e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1',
        ],
        labels: {},
        expected: {
            '023e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1':
                'f438b40179a3c4262de12986c0e6cce0634007cdc79c1dcd3e20b9ebc2e7eef6',
        },
    },
    {
        description: 'Simple send: two inputs, order reversed',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
        inputHash:
            '5bfe5321d759e01a2ac9292f0f396ff9c3d8b58d89ccb21a6922e84bb7ad0668',
        outputs: [
            '023e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1',
        ],
        labels: {},
        expected: {
            '023e9fce73d4e77a4809908e3c3a2e54ee147b9312dc5044a193d1fc85de46e3c1':
                'f438b40179a3c4262de12986c0e6cce0634007cdc79c1dcd3e20b9ebc2e7eef6',
        },
    },
    {
        description: 'Simple send: two inputs from the same transaction',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
        inputHash:
            'ca70029b1ca2b9730f341c5bff0c79987213d2ee49f2285958bc0d2df387e851',
        outputs: [
            '0279e71baa2ba3fc66396de3a04f168c7bf24d6870ec88ca877754790c1db357b6',
        ],
        labels: {},
        expected: {
            '0279e71baa2ba3fc66396de3a04f168c7bf24d6870ec88ca877754790c1db357b6':
                '4851455bfbe1ab4f80156570aa45063201aa5c9e1b1dcd29f0f8c33d10bf77ae',
        },
    },
    {
        description:
            'Simple send: two inputs from the same transaction, order reversed',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
        inputHash:
            '402afc065566490b102de1bf599f2f0e045d1379c31945e69ea55f366664a1b1',
        outputs: [
            '02f4c2da807f89cb1501f1a77322a895acfb93c28e08ed2724d2beb8e44539ba38',
        ],
        labels: {},
        expected: {
            '02f4c2da807f89cb1501f1a77322a895acfb93c28e08ed2724d2beb8e44539ba38':
                'ab0c9b87181bf527879f48db9f14a02233619b986f8e8f2d5d408ce68a709f51',
        },
    },
    {
        description:
            'Single recipient: multiple UTXOs from the same public key',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03e40664e222ba71e29b80efc907fa22a3c6c64f45e89dbb8511dc7a3712b0a186',
        inputHash:
            '37245a9f8355f4064f385fefeac00c022952acc75e5caec6321f066e113397b4',
        outputs: [
            '02548ae55c8eec1e736e8d3e520f011f1f42a56d166116ad210b3937599f87f566',
        ],
        labels: {},
        expected: {
            '02548ae55c8eec1e736e8d3e520f011f1f42a56d166116ad210b3937599f87f566':
                'f032695e2636619efa523fffaa9ef93c8802299181fd0461913c1b8daf9784cd',
        },
    },
    {
        description: 'Single recipient: taproot only inputs with even y-values',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '038180a2125f9d6dd116e1a6139be4d72fd5057dab6aaabaa5654817c11baeb3ba',
        inputHash:
            'd0736c3e1f5b40765a6f6898eb489611fa71229f2fcfbb2a34042d5fca0757d8',
        outputs: [
            '02de88bea8e7ffc9ce1af30d1132f910323c505185aec8eae361670421e749a1fb',
        ],
        labels: {},
        expected: {
            '02de88bea8e7ffc9ce1af30d1132f910323c505185aec8eae361670421e749a1fb':
                '3fb9ce5ce1746ced103c8ed254e81f6690764637ddbc876ec1f9b3ddab776b03',
        },
    },
    {
        description:
            'Single recipient: taproot only with mixed even/odd y-values',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '020f0ab50f420ab1249bc2a21659c607f2873400853035aad0ca6d0ded04d62623',
        inputHash:
            'c166992ca52854ebb5008ebea00586a08b19aef88d74cb0235ffa4090f52e2ed',
        outputs: [
            '0277cab7dd12b10259ee82c6ea4b509774e33e7078e7138f568092241bf26b99f1',
        ],
        labels: {},
        expected: {
            '0277cab7dd12b10259ee82c6ea4b509774e33e7078e7138f568092241bf26b99f1':
                'f5382508609771068ed079b24e1f72e4a17ee6d1c979066bf1d4e2a5676f09d4',
        },
    },
    {
        description:
            'Single recipient: taproot input with even y-value and non-taproot input',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '031ecda9c64faaa6cd57c9f3d7c62bcfc0763c2627ed8dc0e2c3018e9ff37a0bf0',
        inputHash:
            '89c79a4bb917f3ba868c6ab3435afd8b9830102358810ad319a0d483accee221',
        outputs: [
            '0230523cca96b2a9ae3c98beb5e60f7d190ec5bc79b2d11a0b2d4d09a608c448f0',
        ],
        labels: {},
        expected: {
            '0230523cca96b2a9ae3c98beb5e60f7d190ec5bc79b2d11a0b2d4d09a608c448f0':
                'b40017865c79b1fcbed68896791be93186d08f47e416b289b8c063777e14e8df',
        },
    },
    {
        description:
            'Single recipient: taproot input with odd y-value and non-taproot input',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03bc118b1c8178915b716d6137633722c71adfe721551ec7b3938054691de6a2b9',
        inputHash:
            '2c648edc10c4f485a825c6cbc12db0966c98c4b05ed13fde156d3647bcd061d9',
        outputs: [
            '02359358f59ee9e9eec3f00bdf4882570fd5c182e451aa2650b788544aff012a3a',
        ],
        labels: {},
        expected: {
            '02359358f59ee9e9eec3f00bdf4882570fd5c182e451aa2650b788544aff012a3a':
                'a2f9dd05d1d398347c885d9c61a64d18a264de6d49cea4326bafc2791d627fa7',
        },
    },
    {
        description: 'Multiple outputs: multiple outputs, same recipient',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca',
            '02841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8',
            '022e847bb01d1b491da512ddd760b8509617ee38057003d6115d00ba562451323a',
        ],
        labels: {},
        expected: {
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac':
                '33ce085c3c11eaad13694aae3c20301a6c83382ec89a7cde96c6799e2f88805a',
            '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca':
                'd97e442d110c0bdd31161a7bb6e7862e038d02a09b1484dfbb463f2e0f7c9230',
        },
    },
    {
        description: 'Multiple outputs: multiple outputs, multiple recipients',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca',
            '02841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8',
            '022e847bb01d1b491da512ddd760b8509617ee38057003d6115d00ba562451323a',
        ],
        labels: {},
        expected: {
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac':
                '33ce085c3c11eaad13694aae3c20301a6c83382ec89a7cde96c6799e2f88805a',
            '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca':
                'd97e442d110c0bdd31161a7bb6e7862e038d02a09b1484dfbb463f2e0f7c9230',
        },
    },
    {
        description: 'Multiple outputs: multiple outputs, multiple recipients',
        scanPrivateKey:
            '060b751d7892149006ed7b98606955a29fe284a1e900070c0971f5fb93dbf422',
        spendPublicKey:
            '0381eb9a9a9ec739d527c1631b31b421566f5c2a47b4ab5b1f6a686dfb68eab716',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '02e976a58fbd38aeb4e6093d4df02e9c1de0c4513ae0c588cef68cda5b2f8834ca',
            '02841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8',
            '022e847bb01d1b491da512ddd760b8509617ee38057003d6115d00ba562451323a',
        ],
        labels: {},
        expected: {
            '02841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8':
                '2f17ea873a0047fc01ba8010fef0969e76d0e4283f600d48f735098b1fee6eb9',
            '022e847bb01d1b491da512ddd760b8509617ee38057003d6115d00ba562451323a':
                '72cd082cccb633bf85240a83494b32dc943a4d05647a6686d23ad4ca59c0ebe4',
        },
    },
    {
        description: 'Receiving with labels: label with odd parity',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02d014d4860f67d607d60b1af70e0ee236b99658b61bb769832acbbe87c374439a',
        ],
        labels: {
            '0244962c484602f40b7729680ac00e4e118f0a84034bd9445a61234c5e3b5eea54':
                '1e06e1749870cac2eda06a04a54fc4edba17cba9377ead25a69b6306711ea9f8',
            '03cfda89f13b01fcd27703ab4a1da45ca731bf28efaabbbb5ad11c20a8a3f28b71':
                '2c56a5c50c644abe7a282c68ab504d0c0e5e31e1126d614be1a4fb098c455e53',
            '03615a94bbe5ad3dca03ff7aa9525b678bfd4d5443873f48b6d47113cda87cfa3e':
                'af68b0c6f4b1458314f3998004f57d78689640e4fff389da7064d0fd183de448',
        },
        expected: {
            '02d014d4860f67d607d60b1af70e0ee236b99658b61bb769832acbbe87c374439a':
                '51d4e9d0d482b5700109b4b2e16ff508269b03d800192a043d61dca4a0a72a52',
        },
    },
    {
        description: 'Receiving with labels: label with odd parity',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '0267626aebb3c4307cf0f6c39ca23247598fabf675ab783292eb2f81ae75ad1f8c',
        ],
        labels: {
            '0244962c484602f40b7729680ac00e4e118f0a84034bd9445a61234c5e3b5eea54':
                '1e06e1749870cac2eda06a04a54fc4edba17cba9377ead25a69b6306711ea9f8',
            '03cfda89f13b01fcd27703ab4a1da45ca731bf28efaabbbb5ad11c20a8a3f28b71':
                '2c56a5c50c644abe7a282c68ab504d0c0e5e31e1126d614be1a4fb098c455e53',
            '03615a94bbe5ad3dca03ff7aa9525b678bfd4d5443873f48b6d47113cda87cfa3e':
                'af68b0c6f4b1458314f3998004f57d78689640e4fff389da7064d0fd183de448',
        },
        expected: {
            '0267626aebb3c4307cf0f6c39ca23247598fabf675ab783292eb2f81ae75ad1f8c':
                '6024ae214876356b8d917716e7707d267ae16a0fdb07de2a786b74a7bbcddead',
        },
    },
    {
        description: 'Receiving with labels: label with odd parity',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '027efa60ce78ac343df8a013a2027c6c5ef29f9502edcbd769d2c21717fecc5951',
        ],
        labels: {
            '0244962c484602f40b7729680ac00e4e118f0a84034bd9445a61234c5e3b5eea54':
                '1e06e1749870cac2eda06a04a54fc4edba17cba9377ead25a69b6306711ea9f8',
            '03cfda89f13b01fcd27703ab4a1da45ca731bf28efaabbbb5ad11c20a8a3f28b71':
                '2c56a5c50c644abe7a282c68ab504d0c0e5e31e1126d614be1a4fb098c455e53',
            '03615a94bbe5ad3dca03ff7aa9525b678bfd4d5443873f48b6d47113cda87cfa3e':
                'af68b0c6f4b1458314f3998004f57d78689640e4fff389da7064d0fd183de448',
        },
        expected: {
            '027efa60ce78ac343df8a013a2027c6c5ef29f9502edcbd769d2c21717fecc5951':
                'e336b92330c33030285ce42e4115ad92d5197913c88e06b9072b4a9b47c664a2',
        },
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
        ],
        labels: {
            '0298dc9b3e9283cb8cf8c2f2580f0d9c76143195a49f5f5d9136abfd8bf12134ee':
                '6991cb5ce09ab332d7067838bd183f4da1e9b633743f8616a03fb6cdd8956825',
        },
        expected: {
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac':
                '33ce085c3c11eaad13694aae3c20301a6c83382ec89a7cde96c6799e2f88805a',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c':
                '43100f89f1a6bf10081c92b473ffc57ceac7dbed600b6aba9bb3976f17dbb914',
        },
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '0283dc944e61603137294829aed56c74c9b087d80f2c021b98a7fae5799000696c',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
        ],
        labels: {
            '0298dc9b3e9283cb8cf8c2f2580f0d9c76143195a49f5f5d9136abfd8bf12134ee':
                '6991cb5ce09ab332d7067838bd183f4da1e9b633743f8616a03fb6cdd8956825',
        },
        expected: {
            '0283dc944e61603137294829aed56c74c9b087d80f2c021b98a7fae5799000696c':
                '9d5fd3b91cac9ddfea6fc2e6f9386f680e6cee623cda02f53706306c081de87f',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c':
                '43100f89f1a6bf10081c92b473ffc57ceac7dbed600b6aba9bb3976f17dbb914',
        },
    },
    {
        description:
            'Multiple outputs with labels: multiple outputs for labeled address; same recipient',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c',
            '02ae1a780c04237bd577283c3ddb2e499767c3214160d5a6b0767e6b8c278bd701',
            '02f4569fc5f69c10f0082cfbb8e072e6266ec55f69fba8cffca4cbb4c144b7e59b',
        ],
        labels: {
            '0298dc9b3e9283cb8cf8c2f2580f0d9c76143195a49f5f5d9136abfd8bf12134ee':
                '6991cb5ce09ab332d7067838bd183f4da1e9b633743f8616a03fb6cdd8956825',
        },
        expected: {
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac':
                '33ce085c3c11eaad13694aae3c20301a6c83382ec89a7cde96c6799e2f88805a',
            '0239f42624d5c32a77fda80ff0acee269afec601d3791803e80252ae04e4ffcf4c':
                '43100f89f1a6bf10081c92b473ffc57ceac7dbed600b6aba9bb3976f17dbb914',
        },
    },
    {
        description: 'Single recipient: use silent payments for sender change',
        scanPrivateKey:
            '11b7a82e06ca2648d5fded2366478078ec4fc9dc1d8ff487518226f229d768fd',
        spendPublicKey:
            '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '02be368e28979d950245d742891ae6064020ba548c1e2e65a639a8bb0675d95cff',
        ],
        labels: {
            '03792926eb783d9a868b52ad5eef38962112c5c7a1262c4cce17fc1a6b22fb0bf2':
                '015d1b458151642ee96c0f534aa795c962dc3ece7eeebe4d0e30820391a53bea',
        },
        expected: {
            '02be368e28979d950245d742891ae6064020ba548c1e2e65a639a8bb0675d95cff':
                '80cd767ed20bd0bb7d8ea5e803f8c381293a62e8a073cf46fb0081da46e64e1f',
        },
    },
    {
        description: 'Single recipient: use silent payments for sender change',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac',
            '02be368e28979d950245d742891ae6064020ba548c1e2e65a639a8bb0675d95cff',
        ],
        labels: {},
        expected: {
            '02f207162b1a7abc51c42017bef055e9ec1efc3d3567cb720357e2b84325db33ac':
                '33ce085c3c11eaad13694aae3c20301a6c83382ec89a7cde96c6799e2f88805a',
        },
    },
    {
        description: 'Single receipient: taproot input with NUMS point',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '02782eeb913431ca6e9b8c2fd80a5f72ed2024ef72a3c6fb10263c379937323338',
        inputHash:
            '7488bcb061b294f9936c6011f10e36b1a226fa0de98bdb1781d680dac829d852',
        outputs: [
            '0279e79897c52935bfd97fc6e076a6431a0c7543ca8c31e0fc3cf719bb572c842d',
        ],
        labels: {},
        expected: {
            '0279e79897c52935bfd97fc6e076a6431a0c7543ca8c31e0fc3cf719bb572c842d':
                '3ddec3232609d348d6b8b53123b4f40f6d4f5398ca586f087b0416ec3b851496',
        },
    },
    {
        description: 'Pubkey extraction from malleated p2pkh',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '038b0d201fe111bdc0e6953772bd02a41959d25d5b2f66bcbe348af27bbdd42735',
        inputHash:
            'aade43188c62354b11952d20585f2cf94aaf3d4451e98c3bd9f71a1d6b0ce5ef',
        outputs: [
            '024612cdbf845c66c7511d70aab4d9aed11e49e48cdb8d799d787101cdd0d53e4f',
        ],
        labels: {},
        expected: {
            '024612cdbf845c66c7511d70aab4d9aed11e49e48cdb8d799d787101cdd0d53e4f':
                '10bde9781def20d7701e7603ef1b1e5e71c67bae7154818814e3c81ef5b1a3d3',
        },
    },
    {
        description: 'P2PKH and P2WPKH Uncompressed Keys are skipped',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '025a1e61f898173040e20616d43e9f496fba90338a39faa1ed98fcbaeee4dd9be5',
        inputHash:
            '9be481e9efc788e2344fbbacc42db86d5e191a4269cace545bb847bdbb251bfc',
        outputs: [
            '0267fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6',
        ],
        labels: {},
        expected: {
            '0267fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6':
                '688fa3aeb97d2a46ae87b03591921c2eaf4b505eb0ddca2733c94701e01060cf',
        },
    },
    {
        description: 'Skip invalid P2SH inputs',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '025a1e61f898173040e20616d43e9f496fba90338a39faa1ed98fcbaeee4dd9be5',
        inputHash:
            '9be481e9efc788e2344fbbacc42db86d5e191a4269cace545bb847bdbb251bfc',
        outputs: [
            '0267fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6',
        ],
        labels: {},
        expected: {
            '0267fee277da9e8542b5d2e6f32d660a9bbd3f0e107c2d53638ab1d869088882d6':
                '688fa3aeb97d2a46ae87b03591921c2eaf4b505eb0ddca2733c94701e01060cf',
        },
    },
    {
        description: 'Recipient ignores unrelated outputs',
        scanPrivateKey:
            '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
        spendPublicKey:
            '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
        sumOfInputPublicKeys:
            '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
        inputHash:
            'd9a9c2445c8384c1e916faef4a997f00852b877cc959dc69dc1d2bb631eb8f5b',
        outputs: [
            '02782eeb913431ca6e9b8c2fd80a5f72ed2024ef72a3c6fb10263c379937323338',
            '02841792c33c9dc6193e76744134125d40add8f2f4a96475f28ba150be032d64e8',
        ],
        labels: {},
        expected: {},
    },
];

export const scanTweakVectors = [
    {
        description: 'single matching output',
        scanPrivateKey:
            '38658693c017c46fd6b8bb94b8766c123cd5baf6026338305b6f59f82b36f9c0',
        spendPublicKey:
            '02833085c9a716d36b467552c00d6aa8bd42e39adbe98b05bc203110177192f702',
        tweak: '02ccd442a997b40661a9a1e233884986a9c970f5da3b68514c6ea2533b708e2ae1',
        outputs: [
            '025a90a5fad7ab4d32e41fd02de786f7af3ecbe85bd18784e51e89a97c8693ca3c',
        ],
        expectedTweakHex:
            '635aaddb7a1f7f64a6b78ddf47772ae987f6e29b79bb4eebbf1826f21af25e39',
    },
    {
        description: 'no matching outputs',
        scanPrivateKey:
            '38658693c017c46fd6b8bb94b8766c123cd5baf6026338305b6f59f82b36f9c0',
        spendPublicKey:
            '02833085c9a716d36b467552c00d6aa8bd42e39adbe98b05bc203110177192f702',
        tweak: '02ccd442a997b40661a9a1e233884986a9c970f5da3b68514c6ea2533b708e2ae1',
        outputs: [
            '03aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',
        ],
        expectedTweakHex: null,
    },
    {
        description: 'multiple matching outputs',
        scanPrivateKey:
            '38658693c017c46fd6b8bb94b8766c123cd5baf6026338305b6f59f82b36f9c0',
        spendPublicKey:
            '02833085c9a716d36b467552c00d6aa8bd42e39adbe98b05bc203110177192f702',
        tweak: '02ccd442a997b40661a9a1e233884986a9c970f5da3b68514c6ea2533b708e2ae1',
        outputs: [
            '025a90a5fad7ab4d32e41fd02de786f7af3ecbe85bd18784e51e89a97c8693ca3c',
            '025a90a5fad7ab4d32e41fd02de786f7af3ecbe85bd18784e51e89a97c8693ca3c',
        ],
        expectedTweakHex:
            '635aaddb7a1f7f64a6b78ddf47772ae987f6e29b79bb4eebbf1826f21af25e39',
    },
];
