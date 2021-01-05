import { IRouterContext } from 'koa-router'
import { File } from 'formidable'
import db from './db'
import * as mailchimp from './mailchimp'
import * as scrape from './external-apis/scrape'
import * as clearbit from './external-apis/clearbit'
import * as twitter from './external-apis/twitter'
import passport from './auth/passport'
import { saveFeedback, extractImageData } from './models/feedback'
import { upsertWebsite } from './models/websites'

const fromBody = (ctx: IRouterContext, fieldName: string, type: 'string' | 'number' | 'boolean') => {
  const value = ctx.request.body[fieldName]
  if (!value || typeof value !== type) {
    throw { status: 400, message: `Body must include ${fieldName}, a ${type}` }
  }
  return value
}

const extractFiles = (ctx: IRouterContext, fieldName: string): ReadonlyArray<File> => {
  const maybeFile: undefined | File | ReadonlyArray<File> = ctx.request.files?.[fieldName]
  if (!maybeFile) return []
  return Array.isArray(maybeFile) ? maybeFile : [maybeFile]
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

const domainOf = (url: string): string => {
  const host = hostOf(url)
  return host.replace(/^www\./, '')
}

function getCurrentUser(ctx: IRouterContext): SerializedUser {
  const user: Maybe<SerializedUser> = ctx.session?.passport?.user
  if (!user) {
    throw { status: 401, message: 'Unauthorized' }
  }
  return user
}

export async function getWebsite(ctx: IRouterContext): Promise<any> {
  const domain = domainOf(fromQuery(ctx, 'domain'))

  const [websiteRow] = await db.from('websites').select('twitter_handle').where({ domain })

  if (websiteRow && websiteRow.twitter_handle) {
    return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: websiteRow.twitter_handle } })
  }

  const twitterHandle = await scrape.getTwitterHandle(domain) || await clearbit.getTwitterHandle(domain)

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  // tslint:disable-next-line: no-expression-statement
  await upsertWebsite({ domain, twitter_handle: twitterHandle })

  return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: twitterHandle } })
}

// Redirect the user to Twitter for authentication. When complete, Twitter
// will redirect the user back to the application at
// /auth/twitter/callback
export const authTwitter = passport.authenticate('twitter')

// Twitter will redirect the user to this URL after approval. Finish the
// authentication process by attempting to obtain an access token. If
// access was granted, the user will be logged in. Otherwise,
// authentication has failed.
export const authTwitterCallback = passport.authenticate('twitter', {
  successRedirect: '/auth-success',
  failureRedirect: '/welcome'
})

export function getMe(ctx: IRouterContext): any {
  const me = getCurrentUser(ctx)
  return Object.assign(ctx.response, { status: 200, body: { photoUrl: me.photo } })
}

// tslint:disable-next-line: typedef
function buildTweetParams(user: SerializedUser, status: string, imagesData: ReadonlyArray<FeedbackImageData>) {
  return {
    status,
    feedback_images: imagesData.map(imageData => imageData.file),
    access_token: user.token,
    access_token_secret: user.tokenSecret
  }
}

export const postFeedback = async (ctx: IRouterContext): Promise<any> => {
  const status = fromBody(ctx, 'status', 'string')

  const hostOrDomain = ctx.request.body.domain || ctx.request.body.host
  if (!hostOrDomain || typeof hostOrDomain !== 'string') {
    throw { status: 400, message: `Body must include domain, a string` }
  }

  const domain = domainOf(hostOrDomain)

  // Support images under the field name 'images' or 'screenshots'
  const images = extractFiles(ctx, 'images').concat(extractFiles(ctx, 'screenshots'))

  const user = getCurrentUser(ctx)
  const imagesData = await extractImageData(images)
  const { url } = await twitter.tweetStatus(buildTweetParams(user, status, imagesData))
  // tslint:disable-next-line: no-expression-statement
  await saveFeedback({ user, status, domain, imagesData, url })

  return Object.assign(ctx.response, { status: 201, body: { url } })
}

export async function logout(ctx: IRouterContext): Promise<any> {
  ctx.session = null // tslint:disable-line: no-expression-statement
  return Object.assign(ctx.response, { status: 200, body: { loggedOut: true } })
}

export async function subscribe(ctx: IRouterContext): Promise<any> {
  const email: string = fromBody(ctx, 'email', 'string')
  await mailchimp.subscribe(email) // tslint:disable-line: no-expression-statement
  return Object.assign(ctx.response, { status: 201 })
}
