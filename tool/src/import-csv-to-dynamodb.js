import {
    DynamoDBClient,
    BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb'
import * as fs from "fs";
import { parse } from "csv-parse";

let envFileName = '';
if (process.env.NODE_ENV === 'staging') {
    envFileName = './.env.staging';
} else if (process.env.NODE_ENV === 'production') {
    envFileName = './.env.production';
} else {
    envFileName = './.env.development';
}
import * as dotenv from 'dotenv';
const config = dotenv.config({ path: envFileName }).parsed;

const csvFile = './csv/out.csv';

const main = async function () {
    let dynamodbConfig = config.USE_DYNAMODB_LOCAL === "true" ? {
        'region': config.DYNAMODB_REGION,
        'credentials': { accessKeyId: 'FAKE', secretAccessKey: 'FAKE' },
        'endpoint': config.DYNAMODB_LOCAL_URL,
    } : {
        'region': config.DYNAMODB_REGION,
    }
    console.log(dynamodbConfig);

    const readStream = fs.createReadStream(csvFile)
        .pipe(parse({ delimiter: "::", from_line: 2 })
        );

    const dynamoDBClient = new DynamoDBClient(dynamodbConfig)
    const tableName = config.DYNAMODB_TABLE_DONOR;

    const systemDate = new Date().getTime();
    let index = 0;
    let writeRequests = [];
    for await (const chuck of readStream) {
        if (index % 25 == 0) {
            writeRequests = [];
        }
        index++;

        const data = chuck[0].split(',');
        writeRequests.push({
            PutRequest: {
                Item: {
                    token_id: { "S": data[0] },
                    code: { "S": data[1] },
                    token_uri: { "S": data[2] },
                    image_url: { "S": data[3] },
                    token_name: { "S": config.SBT_NAME },
                    is_verified: { "BOOL": false },
                    is_sent_token: { "BOOL": false },
                    is_used: { "BOOL": false },
                    created_at: { "N": systemDate + "" },
                    created_by: { "S": "admin" },
                    updated_at: { "N": systemDate + "" },
                    updated_by: { "S": "admin" },
                    delete_flg: { "BOOL": false },
                }
            }
        })

        if (index % 25 == 0) {
            const result = await dynamoDBClient.send(
                new BatchWriteItemCommand({
                    RequestItems: {
                        [tableName]: writeRequests, // キーにテーブル名を指定
                    },
                })
            )
        }

    }

    if (index % 25 != 0) {
        const result = await dynamoDBClient.send(
            new BatchWriteItemCommand({
                RequestItems: {
                    [tableName]: writeRequests, // キーにテーブル名を指定
                },
            })
        )
    }

    console.log('保存結果完了しました');
}

main();