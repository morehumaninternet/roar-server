import { IRouterContext } from 'koa-router'
import { fromBody } from './fromBody'
import { fromQuery } from './fromQuery'
import { extractFiles } from './extractFiles'
import { getCurrentUser } from './getCurrentUser'
import { domainOf } from './parseUrl'
import db from '../db'
import * as mailchimp from '../external-apis/mailchimp'
import * as scrape from '../external-apis/scrape'
import * as clearbit from '../external-apis/clearbit'
import * as twitter from '../external-apis/twitter'
import { saveFeedback, extractImageData } from '../models/feedback'
import { upsertWebsite } from '../models/websites'

type Handler<T> = (ctx: IRouterContext) => Promise<
  T extends undefined
    ? { status: 200 | 201 }
    : { status: 200 | 201, body: T }
>

export const getWebsite: Handler<{ domain: string, twitter_handle: null | string }> = async ctx => {
  const domain = domainOf(fromQuery(ctx, 'domain'))

  const [websiteRow] = await db.from('websites').select('twitter_handle').where({ domain })

  if (websiteRow && websiteRow.twitter_handle) {
    return { status: 200, body: { domain, twitter_handle: websiteRow.twitter_handle } }
  }

  const twitterHandle = await scrape.getTwitterHandle(domain) || await clearbit.getTwitterHandle(domain)

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  // tslint:disable-next-line: no-expression-statement
  await upsertWebsite({ domain, twitter_handle: twitterHandle })

  return { status: 200, body: { domain, twitter_handle: twitterHandle } }
}

export const getMe: Handler<{ photoUrl: null | string }> = async ctx => {
  const me = getCurrentUser(ctx)
  return { status: 200, body: { photoUrl: me.photo || null } }
}

export const postFeedback: Handler<{ url: string }> = async ctx => {
  const status = fromBody(ctx, 'status', 'string')

  const hostOrDomain = ctx.request.body.domain || ctx.request.body.host
  if (!hostOrDomain || typeof hostOrDomain !== 'string') {
    throw { status: 400, message: `Body must include domain, a string` }
  }

  const domain = domainOf(hostOrDomain)

  // Support images under the field name 'images' or 'screenshots'
  const images = extractFiles(ctx, 'images')

  const user = getCurrentUser(ctx)
  const imagesData = await extractImageData(images)
  const { url } = await twitter.tweetStatus({
    status,
    feedback_images: imagesData.map(imageData => imageData.file),
    access_token: user.token,
    access_token_secret: user.tokenSecret
  })

  // tslint:disable-next-line: no-expression-statement
  await saveFeedback({ user, status, domain, imagesData, url })

  return { status: 201, body: { url } }
}

export const logout: Handler<{ loggedOut: true }> = async ctx => {
  ctx.session = null // tslint:disable-line: no-expression-statement
  return { status: 200, body: { loggedOut: true } }
}

export const subscribe: Handler<undefined> = async ctx => {
  const email: string = fromBody(ctx, 'email', 'string')
  await mailchimp.subscribe(email) // tslint:disable-line: no-expression-statement
  return { status: 201 }
}
