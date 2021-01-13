import axios from 'axios'
import * as cheerio from 'cheerio'

async function getHtml(urlString: string): Promise<null | string> {
  try {
    const { data } = await axios.get(`http://${urlString}`)
    return data
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw { status: 404, message: `${urlString} Not Found` }
    }
    return console.error(error), null
  }
}

export async function getTwitterHandle(urlString: string): Promise<null | string> {
  const html = await getHtml(urlString)
  if (!html) return null
  const $ = cheerio.load(html)
  const twitterHandle = $('meta[name="twitter:site"]').attr('content') || $('meta[name="twitter:creator"]').attr('content')
  if (!twitterHandle) return null
  if (twitterHandle.startsWith('@')) return twitterHandle
  return `@${twitterHandle}`
}
