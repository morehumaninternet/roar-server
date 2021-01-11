import { IRouterContext } from 'koa-router'
import { fromBody } from './fromBody'
import { parseUrl } from '../parse-url'
import { extractFiles } from './extractFiles'
import { getCurrentUser } from './getCurrentUser'
import * as mailchimp from '../external-apis/mailchimp'
import * as scrape from '../external-apis/scrape'
import * as clearbit from '../external-apis/clearbit'
import * as twitter from '../external-apis/twitter'
import { saveFeedback, extractImageData } from '../models/feedback'
import * as websites from '../models/websites'

type Handler<T> = (ctx: IRouterContext) => Promise<T extends undefined ? { status: 200 | 201 } : { status: 200 | 201; body: T }>

export const getWebsite: Handler<{ domain: string; matching_url: string; twitter_handle: null | string }> = async ctx => {
  const urlString: string | undefined = ctx.request.query.domain || ctx.request.query.url
  if (!urlString) {
    throw { status: 400, message: 'Query must include url, a string' }
  }

  const parsedUrl = parseUrl(urlString)

  const websiteRow = await websites.getBestMatching(parsedUrl)

  if (websiteRow) {
    return {
      status: 200,
      body: {
        domain: parsedUrl.host,
        matching_url: websiteRow.url,
        twitter_handle: websiteRow.twitter_handle,
      },
    }
  }

  const domain = parsedUrl.host

  const twitterHandle = (await scrape.getTwitterHandle(parsedUrl)) || (await clearbit.getTwitterHandle(domain))

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  // tslint:disable-next-line: no-expression-statement
  await websites.upsert({ url: domain, twitter_handle: twitterHandle })

  return { status: 200, body: { domain, matching_url: domain, twitter_handle: twitterHandle } }
}

export const getMe: Handler<{ photoUrl: null | string }> = async ctx => {
  const me = getCurrentUser(ctx)
  return { status: 200, body: { photoUrl: me.photo || null } }
}

export const postFeedback: Handler<{ url: string }> = async ctx => {
  const status = fromBody(ctx, 'status', 'string')

  const matchingUrl = ctx.request.body.matching_url || ctx.request.body.domain || ctx.request.body.host
  if (!matchingUrl || typeof matchingUrl !== 'string') {
    throw { status: 400, message: `Body must include domain, a string` }
  }

  // Normalize the incoming url
  const websiteUrl = parseUrl(matchingUrl).fullWithFirstPath

  // Support images under the field name 'images' or 'screenshots'
  const images = extractFiles(ctx, 'images')

  const user = getCurrentUser(ctx)
  const imagesData = await extractImageData(images)
  const { url } = await twitter.tweetStatus({
    status,
    feedback_images: imagesData.map(imageData => imageData.file),
    access_token: user.token,
    access_token_secret: user.tokenSecret,
  })

  // tslint:disable-next-line: no-expression-statement
  await saveFeedback({ user, status, websiteUrl, imagesData, tweetUrl: url })

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
