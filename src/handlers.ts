import { IRouterContext } from 'koa-router'
import db from './db'
import * as scrape from './scrape'
import * as clearbit from './clearbit'
import * as twitter from './twitter'


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

export async function getWebsite(ctx: IRouterContext): Promise<any> {
  const domain = hostOf(fromQuery(ctx, 'domain'))

  const [websiteRow] = await db.from('websites').select('twitter_handle').where({ domain })

  if (websiteRow) {
    return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: websiteRow.twitter_handle } })
  }

  const twitterHandle = await scrape.getTwitterHandle(domain) || await clearbit.getTwitterHandle(domain)

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  // tslint:disable-next-line: no-expression-statement
  await db('websites').insert({ domain, twitter_handle: twitterHandle })

  return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: twitterHandle } })
}

export async function login(ctx: IRouterContext): Promise<any> {
  try {
    const oauth_token = await twitter.getOauthToken()
    return ctx.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`)
  } catch {
    return Object.assign(ctx.response, { status: 503, body: 'Roar service is currently unavailable.' })
  }
}

export async function processtwitter(ctx: IRouterContext): Promise<any> {
  const oauth_token = fromQuery(ctx, 'oauth_token')
  const oauth_verifier = fromQuery(ctx, 'oauth_verifier')

  try {
    const accessToken = await twitter.processtwitter(oauth_token, oauth_verifier)
    return Object.assign(ctx.response, { status: 200, body: { accessToken } })
  } catch {
    return Object.assign(ctx.response, { status: 200, body: { error: 'Oops! Something wrong.', oauth_token, oauth_verifier } })
  }
}
