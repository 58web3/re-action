async function createPage() {
  
  for (let content of info) {
    
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
            "content": content.title
          }
        }]
        },
        "Date":{
           "date": {
			      "start": content.utc
			    }
        },
        "URL":{
          "url": content.url
        },
        "Pre-approval Status":{
          "status": {
        "name": content.status
      }
        },
        "Contributor":{
          "rich_text": [
        {
          "type": "text",
          "text": {
            "content": content.did
          }
        }]
        },
        "WalletAddress":{
          "rich_text": [
        {
          "type": "text",
          "text": {
            "content": content.waddress
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
              "url": content.url
            }
          }
      }]
    })
    
  }
  
}

getInfo('title',
'url','did','waddress')
