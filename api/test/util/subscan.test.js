
global.dynamoose = require('../../src/init_dynamoose');
const SubscanService = require('../../src/util/subscan');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const testWalletAddress = '0x12e97abfa6e287020d4aaf746926902f81aea023';
const testContractAddress1 = '0x4db24d0c2c55910b0c7951b3639582922550651e';
const testContractAddress2 = '0x9473166a64250958d59572d2bc40e703b316c076';

let mock;

beforeAll(() => {
    mock = new MockAdapter(axios);
});

afterEach(() => {
    mock.reset();
});

describe("subscan", () => {

    test("subscan api key is null", async () => {
        process.env.USE_SECRET_MANAGER = 'false';
        process.env.SUBSCAN_API_KEY = '';

        const subscan = await SubscanService.getAllNFTs(testWalletAddress, [testContractAddress1]);
        expect(subscan.message).toBe('System error');
    });

    test("success", async () => {
        process.env.USE_SECRET_MANAGER = 'false';
        process.env.SUBSCAN_API_KEY = 'key';
        process.env.SUBSCAN_END_POINT = '/subscan';
        
        const nfts = {
            code: 0,
            message: "Success",
            generated_at: 1675827600,
            data: {
                "count": 2,
                "list": [
                    {
                        "contract": testContractAddress1,
                        "holder": testWalletAddress,
                        "token_id": "38"
                    },
                    {
                        "contract": testContractAddress2,
                        "holder": testWalletAddress,
                        "token_id": "46"
                    },
                    {
                        "contract": '0x...FakeContractAddress',
                        "holder": testWalletAddress,
                        "token_id": "1"
                    }
                ]
            }
        }

        mock.onPost(process.env.SUBSCAN_END_POINT).reply(200, nfts);

        const allNFTs = await SubscanService.getAllNFTs(testWalletAddress, [testContractAddress1, testContractAddress2]);

        expect(allNFTs.length).toBe(2);
        expect(allNFTs[0].contract).toBe(testContractAddress1);
        expect(allNFTs[0].holder).toBe(testWalletAddress);
        expect(allNFTs[0].token_id).toBe("38");
        expect(allNFTs[1].contract).toBe(testContractAddress2);
        expect(allNFTs[1].holder).toBe(testWalletAddress);
        expect(allNFTs[1].token_id).toBe("46");
    });
});