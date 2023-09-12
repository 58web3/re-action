const { Client } = require('@notionhq/client')
const AWS = require('@aws-sdk/client-s3');
const notion = new Client({ auth: process.env.NOTION_KEY })

const AWS_S3_BUCKET = process.env.MEDIA_S3_BUCKET;
const AWS_S3_REGION = process.env.AWS_S3_REGION;
const s3 = process.env.USE_ACCESS_KEY === 'true' ?
  new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    },
    region: AWS_S3_REGION,
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true'
  })
  : new AWS.S3({
    region: AWS_S3_REGION
  });

console.log(s3)

const createPage = async (file, title, url, contributor, walletAddress) => {

  const originalname = file.originalname;
  const mimetype = file.mimetype;
  const key = new Date().getTime() + "_" + originalname;

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: mimetype,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: AWS_S3_REGION,
    },
  };

  const children = [];
  children.push({
    "heading_2": {
      "rich_text": [
        {
          "text": {
            "content": "ReEarth Notion Article"
          }
        }
      ]
    }
  });

  try {
    const res = await s3.send(new AWS.PutObjectCommand(params));

    if (key.endsWith(".png") || key.endsWith(".jpg") || key.endsWith(".jpeg") || key.endsWith(".gif") || key.endsWith(".svg")) {
      children.push(
        {
          "type": "image",
          "image": {
            "type": "external",
            "external": {
              "url": "https://" + AWS_S3_BUCKET + ".s3.ap-northeast-1.amazonaws.com/" + key
            }
          }
        }
      );
    } else if (key.endsWith(".mov") || key.endsWith(".mp4") || key.endsWith(".webm")) {
      children.push(
        {
          "type": "video",
          "video": {
            "type": "external",
            "external": {
              "url": "https://" + AWS_S3_BUCKET + ".s3.ap-northeast-1.amazonaws.com/" + key
            }
          }
        }
      );
    } else {
      children.push(
        {
          "type": "file",
          "file": {
            "type": "external",
            "external": {
              "url": "https://" + AWS_S3_BUCKET + ".s3.ap-northeast-1.amazonaws.com/" + key
            }
          }
        }
      );
    }

  } catch (e) {
    logger.error(e);
  }

  const requestBody = {
    "parent": {
      "type": "database_id",
      "database_id": process.env.NOTION_DATABASE_ID
    },
    "properties": {
      "Title": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": title
            }
          }
        ]
      },
      "Date": {
        "date": {
          "start": new Date().toISOString()
        }
      },
      // "URL": {
      //   "url": url
      // },
      "Status": {
        "status": {
          "name": "pre-approved"
        }
      },
      "Contributor": {
        "rich_text": [  // Only use 'rich_text' if this is a rich text field in your database
          {
            "type": "text",
            "text": {
              "content": contributor  // Removed the HTML tags
            }
          }
        ]
      },
      "WalletAddress": {
        "rich_text": [  // Only use 'rich_text' if this is a rich text field in your database
          {
            "type": "text",
            "text": {
              "content": walletAddress  // Removed the HTML tags
            }
          }
        ]
      }
    },
    "children": children,
  };

  const response = await notion.pages.create(requestBody);

  console.log(response);

  return response.url;

}

module.exports = {
  createPage,
};
