const {Client} = require('@notionhq/client')

const notion = new Client({auth: process.env.NOTION_KEY})

const info = []

async function getInfo(t,u,c,w) {
  const data = {
    "title": t,
    "utc": new Date().toISOString(),
    "url": u,
    "status": 'pre-approved',
    "did": c,
    "waddress": w,
  }
  info.push(data)
  
  createPage()
}
