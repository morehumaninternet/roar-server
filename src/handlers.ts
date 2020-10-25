import { IRouterContext } from 'koa-router'
import axios from 'axios'
import * as cheerio from 'cheerio'
import db from './db'


const fromBody = (ctx: IRouterContext, fieldName: string, type: 'string' | 'number' | 'boolean') => {
  const value = ctx.request.body[fieldName]
  if (!value || typeof value !== type) {
    throw { status: 400, message: `Body must include ${fieldName}, a ${type}` }
  }
  return value
}

const fromQuery = (ctx: IRouterContext, fieldName: string, type: 'string' = 'string') => {
  const value = ctx.request.query[fieldName]
  if (!value) {
    throw { status: 400, message: `Body must include ${fieldName}, a ${type}` }
  }
  return value
}

const hostOf = (url: string): string => {
  try {
    return (new URL(url)).host
  } catch {
    try {
      return (new URL(`https://${url}`)).host
    } catch {
      throw { status: 400, message: `${url} must be an URL` }
    }
  }
}

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

export async function getWebsite(ctx: IRouterContext): Promise<any> {
  const domain = hostOf(fromQuery(ctx, 'domain'))

  const [websiteRow] = await db.from('websites').select('twitter_handle').where({ domain })

  if (websiteRow && websiteRow.twitter_handle) {
    return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: websiteRow.twitter_handle } })
  }

  if (!websiteRow) {
    const $ = cheerio.load(await getHtml(domain))
    const twitterHandleFromHtml = $('meta[name="twitter:site"]').attr('content') || $('meta[name="twitter:creator"]').attr('content') || null
    if (twitterHandleFromHtml) {
      await db('websites').insert({ domain, twitter_handle: twitterHandleFromHtml })
    }

    return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: twitterHandleFromHtml } })
  }
}
