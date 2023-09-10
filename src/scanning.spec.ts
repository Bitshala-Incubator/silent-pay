import { scanOutputs } from './scanning';
import { LabelMap } from './interface';

describe('Scanning', () => {
    it.each([
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9',
            ],
            matches: {
                '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9':
                    '8e4bbee712779f746337cadf39e8b1eab8e8869dd40f2e3a7281113e858ffc0b',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9',
            ],
            matches: {
                '0239a1e5ff6206cd316151b9b34cee4f80bb48ce61adee0a12ce7ff05ea436a1d9':
                    '8e4bbee712779f746337cadf39e8b1eab8e8869dd40f2e3a7281113e858ffc0b',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
            outpointHash:
                'dd7d2a8678cb65b52119af415b578437f5dfc0d9f5bf2daac5e25c21bf0731ce',
            outputs: [
                '02162f2298705b3ddca01ce1d214eedff439df3927582938d08e29e464908db00b',
            ],
            matches: {
                '02162f2298705b3ddca01ce1d214eedff439df3927582938d08e29e464908db00b':
                    'f06d8d90561bdbc3e511c3bec7355ad3c858aaf38a132c772d6cd82ec04102ac',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '032562c1ab2d6bd45d7ca4d78f569999e5333dffd3ac5263924fd00d00dedc4bee',
            outpointHash:
                '1b85dfe15f0d5e1cedd47bdd70c24ecb0e3401c0a2ace659c422916626b66bce',
            outputs: [
                '02d9ede52f7e1e64e36ccf895ca0250daad96b174987079c903519b17852b21a3f',
            ],
            matches: {
                '02d9ede52f7e1e64e36ccf895ca0250daad96b174987079c903519b17852b21a3f':
                    '44b827516c2128287b1d571add7cfeb42f122e86bc40b4eb2b21ac144607fdb2',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03e40664e222ba71e29b80efc907fa22a3c6c64f45e89dbb8511dc7a3712b0a186',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '020aafdcdb5893ae813299b16eea75f34ec16653ac39171da04d7c4e6d2e09ab8e',
            ],
            matches: {
                '020aafdcdb5893ae813299b16eea75f34ec16653ac39171da04d7c4e6d2e09ab8e':
                    'bf7336bdc02f624715aab385cc62b71f6f494bf8a7dd0fd621cfd365039c39d1',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '038180a2125f9d6dd116e1a6139be4d72fd5057dab6aaabaa5654817c11baeb3ba',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e',
            ],
            matches: {
                '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e':
                    '0734de077e436e8f6f125e16287cb60dead8ebddc8532be3589ba27156f1add2',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '038180a2125f9d6dd116e1a6139be4d72fd5057dab6aaabaa5654817c11baeb3ba',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e',
            ],
            matches: {
                '0215d1dfe4403791509cf47f073be2eb3277decabe90da395e63b1f49a09fe965e':
                    '0734de077e436e8f6f125e16287cb60dead8ebddc8532be3589ba27156f1add2',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '031ecda9c64faaa6cd57c9f3d7c62bcfc0763c2627ed8dc0e2c3018e9ff37a0bf0',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '022b4ff8e5bc608cbdd12117171e7d265b6882ad597559caf67b5ecfaf15301dd0',
            ],
            matches: {
                '022b4ff8e5bc608cbdd12117171e7d265b6882ad597559caf67b5ecfaf15301dd0':
                    '17d93733d2acd8388279c24dc4413483802378c99f266f5961ac3338c5146861',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '02ef85ee8dc78102f2fd062d3b321f0b4527f0b954ed14b93b0090c8514c9b6a03',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0275f501f319db549aaa613717bd7af44da566d4d859b67fe436946564fafc47a3',
            ],
            matches: {
                '0275f501f319db549aaa613717bd7af44da566d4d859b67fe436946564fafc47a3':
                    '619a5a59a16d4a8e857ef48e63ef7c8195c858191d4e826205e8438ab70d059e',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '020a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09',
                '02c58e121044b23cba9b4695052229a9fd9e044b579f92864eb886ae7c99b021c9',
                '024b15b75f3f184328c4a2f7c79357481ed06cf3b6f95512d5ed946fdc0b60d62b',
            ],
            matches: {
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e30',
                '020a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09':
                    'd39df91bd0e7825bfa1d30096febc5bf6fa7da79d7f25b7b4bea9538cc9a9f7f',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '020a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09',
                '02c58e121044b23cba9b4695052229a9fd9e044b579f92864eb886ae7c99b021c9',
                '024b15b75f3f184328c4a2f7c79357481ed06cf3b6f95512d5ed946fdc0b60d62b',
            ],
            matches: {
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e30',
                '020a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09':
                    'd39df91bd0e7825bfa1d30096febc5bf6fa7da79d7f25b7b4bea9538cc9a9f7f',
            },
        },
        {
            scanPrivateKey:
                '060b751d7892149006ed7b98606955a29fe284a1e900070c0971f5fb93dbf422',
            spendPublicKey:
                '0381eb9a9a9ec739d527c1631b31b421566f5c2a47b4ab5b1f6a686dfb68eab716',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '020a48c6ccc1d516e8244dc0153dc88db45f8f264357667c2057a29ca3c2445d09',
                '02c58e121044b23cba9b4695052229a9fd9e044b579f92864eb886ae7c99b021c9',
                '024b15b75f3f184328c4a2f7c79357481ed06cf3b6f95512d5ed946fdc0b60d62b',
            ],
            matches: {
                '02c58e121044b23cba9b4695052229a9fd9e044b579f92864eb886ae7c99b021c9':
                    '567710d07bdaacc8de3f1cec467bcb162ed7daa6b901b59af257bcd7e39dffcf',
                '024b15b75f3f184328c4a2f7c79357481ed06cf3b6f95512d5ed946fdc0b60d62b':
                    '25dd11163a9a2853709c4c837aafb3347e2eaa875cf4c5170e2a3663879f4c58',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '020050c52a32566c0dfb517e473c68fedce4bd4543d219348d3bbdceeeb5755e34',
            ],
            matches: {
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e30',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '022cbceeab2a4982841eb7dc34b8b4f19c04bf3bc083ebf984f5664366778eb50f',
            ],
            labels: {
                '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5':
                    '0000000000000000000000000000000000000000000000000000000000000002',
                '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9':
                    '0000000000000000000000000000000000000000000000000000000000000003',
                '03348b4f5feb64b557dac8cfa10044bdc2094fca9147163bf514f68687e0d1dba6':
                    '00000000000000000000000000000000000000000000000000000000000f4779',
            },
            matches: {
                '022cbceeab2a4982841eb7dc34b8b4f19c04bf3bc083ebf984f5664366778eb50f':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e32',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '026b4455de119f51bf4d4a12dea555f14a5dc2c1369af5fba4871c5367264c028d',
            ],
            labels: {
                '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5':
                    '0000000000000000000000000000000000000000000000000000000000000002',
                '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9':
                    '0000000000000000000000000000000000000000000000000000000000000003',
                '03348b4f5feb64b557dac8cfa10044bdc2094fca9147163bf514f68687e0d1dba6':
                    '00000000000000000000000000000000000000000000000000000000000f4779',
            },
            matches: {
                '026b4455de119f51bf4d4a12dea555f14a5dc2c1369af5fba4871c5367264c028d':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e33',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '02c3473bfcbe5e4d20d0790ae91f1b339bc15b46de64ca068d140118d0e325b849',
            ],
            labels: {
                '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5':
                    '0000000000000000000000000000000000000000000000000000000000000002',
                '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9':
                    '0000000000000000000000000000000000000000000000000000000000000003',
                '03348b4f5feb64b557dac8cfa10044bdc2094fca9147163bf514f68687e0d1dba6':
                    '00000000000000000000000000000000000000000000000000000000000f4779',
            },
            matches: {
                '02c3473bfcbe5e4d20d0790ae91f1b339bc15b46de64ca068d140118d0e325b849':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc1175a9',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
            ],
            labels: {
                '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798':
                    '0000000000000000000000000000000000000000000000000000000000000001',
            },
            matches: {
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e30',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e':
                    'd39df91bd0e7825bfa1d30096febc5bf6fa7da79d7f25b7b4bea9538cc9a9f80',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '028890c19f005d6f6add5fef92d37ac6b161b7fdd5c1aef6eed1d32be3f216ac4c',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
            ],
            labels: {
                '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798':
                    '0000000000000000000000000000000000000000000000000000000000000001',
            },
            matches: {
                '028890c19f005d6f6add5fef92d37ac6b161b7fdd5c1aef6eed1d32be3f216ac4c':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e31',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e':
                    'd39df91bd0e7825bfa1d30096febc5bf6fa7da79d7f25b7b4bea9538cc9a9f80',
            },
        },
        {
            scanPrivateKey:
                '0f694e068028a717f8af6b9411f9a133dd3565258714cc226594b34db90c1f2c',
            spendPublicKey:
                '025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e',
                '021b90a42136fef9ff2ca192abffc7be4536dc83d4e61cf18ae078f7e92b297cce',
                '0287a82600c08a255bc97d172e10816e322967eed6a77c9f37dd926492d7fdc106',
            ],
            labels: {
                '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798':
                    '0000000000000000000000000000000000000000000000000000000000000001',
                '02db0c51cc634a4096374b0b895584a3ca2fb3bea4fd0ee2361f8db63a650fcee6':
                    '0000000000000000000000000000000000000000000000000000000000000539',
            },
            matches: {
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18':
                    '96439446f13ddaab2c5bc5a59a08992fd9d33bf8563c8a1b362730f4dc022e30',
                '027956317130124c32afd07b3f2432a3e92c1447cf58da95491a307ae3d564535e':
                    'd39df91bd0e7825bfa1d30096febc5bf6fa7da79d7f25b7b4bea9538cc9a9f80',
                '021b90a42136fef9ff2ca192abffc7be4536dc83d4e61cf18ae078f7e92b297cce':
                    '255a912ad6cdebc0842d49fd9f7b2d81ee37d66c62839879371b699010f78ef1',
                '0287a82600c08a255bc97d172e10816e322967eed6a77c9f37dd926492d7fdc106':
                    'd7535d792cb1388ab0b3bd5ff57337436d62f7719c1796beb5d80ab2fa34f307',
            },
        },
        {
            scanPrivateKey:
                '11b7a82e06ca2648d5fded2366478078ec4fc9dc1d8ff487518226f229d768fd',
            spendPublicKey:
                '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
            sumOfInputPublicKeys:
                '03853f51bef283502181e93238c8708ae27235dc51ae45a0c4053987c52fc6428b',
            outpointHash:
                '210fef5d624db17c965c7597e2c6c9f60ef440c831d149c43567c50158557f12',
            outputs: [
                '0264f1c7e8992352d18cdbca600b9e1c3a6025050d56a3e1cc833222e4f3b59e18',
                '020050c52a32566c0dfb517e473c68fedce4bd4543d219348d3bbdceeeb5755e34',
            ],
            labels: {
                '02295dc38e877b754c0d0ed767434f1572cf34a82ccc06ffea1d9e04f1f7878e1a':
                    '91cb04398a508c9d995ff4a18e5eae24d5e9488309f189120a3fdbb977978c46',
            },
            matches: {
                '020050c52a32566c0dfb517e473c68fedce4bd4543d219348d3bbdceeeb5755e34':
                    '2e9c2a37cfa7827907d36357f0632d258dbd14b3a7854937ecf732fb6acefdc8',
            },
        },
    ])(
        'should pass',
        ({
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            outpointHash,
            outputs,
            labels,
            matches,
        }) => {
            const result = scanOutputs(
                Buffer.from(scanPrivateKey, 'hex'),
                Buffer.from(spendPublicKey, 'hex'),
                Buffer.from(sumOfInputPublicKeys, 'hex'),
                Buffer.from(outpointHash, 'hex'),
                outputs.map((output) => Buffer.from(output, 'hex')),
                labels as unknown as LabelMap,
            );

            expect(result).toStrictEqual(
                new Map(
                    Object.entries(matches).map(([output, tweak]) => [
                        output,
                        Buffer.from(tweak as string, 'hex'),
                    ]),
                ),
            );
        },
    );
});
