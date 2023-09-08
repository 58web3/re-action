const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_KEY })

const createPage = async (title, url, contributor, walletAddress) => {

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
    "children": [
    //   {
    //   "object": "block",
    //   "type": "video",
    //   "video": {
    //     "type": "external",
    //     "external": {
    //       "url": url
    //     }
    //   }
    // }
  ]
  };

  const response = await notion.pages.create(requestBody);

  console.log(response);

}

module.exports = {
  createPage,
};
