const API_ENDPOINT = 'https://www.notion.so/api/v3'

export async function rpc(fnName: string, body: any) {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is not set in env')
  }
  
  const res = await fetch(`${API_ENDPOINT}/${fnName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${process.env.NOTION_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    return res.json()
  } else {
    throw new Error(`Notion API error (${res.status})`)
  }
}

export function values(obj: any) {
  const vals: any = []
  Object.keys(obj).forEach(key => {
    vals.push(obj[key])
  })
  return vals
}
