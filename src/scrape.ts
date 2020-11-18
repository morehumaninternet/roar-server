import axios from 'axios'
import * as cheerio from 'cheerio'

async function getHtml(domain: string): Promise<string> {
  try {
    const { data } = await axios.get(`http://${domain}`)
    return data
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      throw { status: 404, message: `Website ${domain} not found` }
    }
    throw err
  }
}

export async function getTwitterHandle(domain: string): Promise<null | string> {
  const $ = cheerio.load(await getHtml(domain))
  const twitterHandle = $('meta[name="twitter:site"]').attr('content') || $('meta[name="twitter:creator"]').attr('content')
  if (!twitterHandle) return null
  if (twitterHandle.startsWith('@')) return twitterHandle
  return `@${twitterHandle}`
}
