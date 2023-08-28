import { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'

export default async (req: VercelRequest, res: VercelResponse) => {
  const baseUrl = 'https://api.n.xyz'
  const keyUrlParam = `&apikey=${process.env.NXYZ_API_KEY}`

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')

  // only allow get requests
  if (req.method !== 'GET') {
    res.status(400).json({ message: 'Not Allowed' })
  }

  try {
    const options = { method: 'GET', headers: { accept: 'application/json' } }
    const requestUrl = baseUrl + req.url + keyUrlParam

    const apiRes = await fetch(requestUrl, options)
    const json = await apiRes.json()
    const cursor = apiRes.headers.get('X-Doc-Next-Cursor')

    if (cursor) {
      res.setHeader('X-Doc-Next-Cursor', cursor)
    }

    res.status(200).send(json)
  } catch (error: any) {
    console.error(error)

    res.status(400).json({ message: error.message })
  }
}
