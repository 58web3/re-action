import * as fs from "fs";
import { parse } from "csv-parse";
import * as ccw from 'csv-writer';

let envFileName = '';
if (process.env.NODE_ENV === 'staging') {
    envFileName = './.env.staging';
} else if (process.env.NODE_ENV === 'production') {
    envFileName = './.env.production';
} else {
    envFileName = './.env.development';
}
import * as dotenv from 'dotenv';
import { exit } from "process";
const config = dotenv.config({ path: envFileName }).parsed;

const main = async function () {

    const metadataDir = './metadata';
    const imagesDir = './images';
    const csvFile = './csv/tokenId_uuid.csv';

    // Read CSV file
    let csvData = [];
    const readStream = fs.createReadStream(csvFile)
        .pipe(parse({ delimiter: ':', from_line: 2 })
        );

    for await (const chuck of readStream) {
        const data = chuck[0].split(',');
        const item = {
            tokenId: data[0],
            uuid: data[1]
        }
        csvData.push(item);
    }

    for (let item of csvData) {
        // imagesフォルダーに画像を読み出す
        const buffer = fs.readFileSync(`${imagesDir}/${config.SBT_IMAGE_NAME_PREFIX}${item.tokenId}.png`);
        // IPFSにアップロード
        const imageCid = await uploadToIPFS(buffer)

        // Token URIを記録する
        item.image = 'ipfs://' + imageCid;

        console.log("image uri:" + item.image);

        // metadata作成
        const metadata = {
            name: config.SBT_NAME + " #" + item.tokenId,
            image: item.image,
            description: config.SBT_DESCRIPTION
        };
        let data = JSON.stringify(metadata);
        fs.writeFileSync(`${metadataDir}/${item.tokenId}.json`, data);

        // メタデータを読み出す
        const metadataBuffer = fs.readFileSync(`${metadataDir}/${item.tokenId}.json`);
        // IPFSへアップロードする
        const metadataCid = await uploadToIPFS(metadataBuffer);

        item.tokenURI = "ipfs://" + metadataCid;
    }

    // Write CSV File
    const createCsvWriter = ccw.createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: './csv/out.csv',
        header: [
            { id: 'tokenId', title: 'Token ID' },
            { id: 'uuid', title: 'UUID' },
            { id: 'tokenURI', title: 'Token URI' },
            { id: 'image', title: 'Image' },
        ]
    });

    csvWriter
        .writeRecords(csvData)
        .then(() => {
            console.log('The CSV file was written successfully');
            exit();
        }
        );
};

const uploadToIPFS = async function (file) {
    const ipfsClient = await import('ipfs-http-client');
    const projectId = config.IPFS_PROJECT_ID;
    const projectSecret = config.IPFS_PROJECT_SECRET;
    const auth =
        'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = ipfsClient.create({
        host: config.IPFS_HOST,
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });

    const result = await client.add(file);

    console.log(result)
    return result.path;
}

main();