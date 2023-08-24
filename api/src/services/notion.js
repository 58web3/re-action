const {Client} = require('@notionhq/client')

const notion = new Client({auth: process.env.NOTION_KEY})


async function createPage(title,url,contributor,waddress) {
  
    
    const repsonse = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": process.env.NOTION_DATABASE_ID
      },
      "properties":{
        "Title": {
          "title": [
        {
          "type": "text",
          "text": {
            "content": title
          }
        }]
        },
        "Date":{
           "date": {
			      "start": new Date().toISOString()
			    }
        },
        "URL":{
          "url": url
        },
        "Pre-approval Status":{
          "status": {
        "name": 'pre-approved'
      }
        },
        "Contributor":{
          "rich_text": [
        {
          "type": "text",
          "text": {
            "content": contributor
          }
        }]
        },
        "WalletAddress":{
          "rich_text": [
        {
          "type": "text",
          "text": {
            "content": waddress
          }
        }]
        }
        
        
      },
      "children":[{
        "object":"block",
        "type": "video",
          "video": {
            "type": "external",
            "external": {
              "url": url
            }
          }
      }]
    })
    
  }

module.exports = {
  createPage,
};
