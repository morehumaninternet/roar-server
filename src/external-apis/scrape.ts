import axios from 'axios'
import * as cheerio from 'cheerio'

type GetHtmlNoFailResult = { success: true; html: string } | { success: false; reason: '404' } | { success: false; reason: 'other'; error: any }

// Get the html of a given page without throwing an error
async function getHtmlNoFail(url: string): Promise<GetHtmlNoFailResult> {
  try {
    const { data } = await axios.get(url)
    return { success: true, html: data }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      return { success: false, reason: '404' }
    }
    return { success: false, reason: 'other', error }
  }
}

async function getHtml(parsedUrl: ParsedUrl): Promise<string> {
  const resultWithoutWww = await getHtmlNoFail(`http://${parsedUrl.host}`)
  if (resultWithoutWww.success) {
    return resultWithoutWww.html
  } else if (resultWithoutWww.reason === 'other') {
    throw resultWithoutWww.error
  } else if (parsedUrl.subdomain) {
    throw { status: 404, message: `Website ${parsedUrl.host} not found` }
  }

  const resultWithWww = await getHtmlNoFail(`http://www.${parsedUrl.host}`)
  if (resultWithWww.success) {
    return resultWithWww.html
  } else if (resultWithWww.reason === 'other') {
    throw resultWithWww.error
  } else {
    throw { status: 404, message: `Website ${parsedUrl.host} not found` }
  }
}

export async function getTwitterHandle(parsedUrl: ParsedUrl): Promise<null | string> {
  const $ = cheerio.load(await getHtml(parsedUrl))
  const twitterHandle = $('meta[name="twitter:site"]').attr('content') || $('meta[name="twitter:creator"]').attr('content')
  if (!twitterHandle) return null
  if (twitterHandle.startsWith('@')) return twitterHandle
  return `@${twitterHandle}`
}
