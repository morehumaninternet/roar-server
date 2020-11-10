import { promisify } from 'util'
import { readFile as fsReadFile, writeFile } from 'fs'
import { IRouterContext } from 'koa-router'
import db from './db'
import * as scrape from './scrape'
import * as clearbit from './clearbit'
import * as twitter from './twitter'
import passport from './passport'
import { File } from 'formidable'

const readFile = promisify(fsReadFile)

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

export async function getWebsite(ctx: IRouterContext): Promise<any> {
  const domain = hostOf(fromQuery(ctx, 'domain'))

  const [websiteRow] = await db.from('websites').select('twitter_handle').where({ domain })

  if (websiteRow && websiteRow.twitter_handle) {
    return Object.assign(ctx.response, { status: 200, body: { domain, twitter_handle: websiteRow.twitter_handle } })
  }

  const twitterHandle = await scrape.getTwitterHandle(domain) || await clearbit.getTwitterHandle(domain)

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  // tslint:disable-next-line: no-expression-statement
  // TODO - upsert!!!!
  await db('websites').insert({ domain, twitter_handle: twitterHandle })

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
  successRedirect: '/v1/auth/twitter/success',
  failureRedirect: '/v1/auth/twitter/failure'
})

export async function authTwitterSuccess(ctx: IRouterContext): Promise<any> {
  // tslint:disable: no-expression-statement
  ctx.type = 'html'
  ctx.body = `
    <script>
      window.parent.postMessage({ type: 'twitter-auth-success' }, '*');
    </script>
  `
  // tslint:enable: no-expression-statement
}

export async function authTwitterFailure(ctx: IRouterContext): Promise<any> {
  // tslint:disable: no-expression-statement
  ctx.type = 'html'
  ctx.body = `
    <script>
      window.parent.postMessage({ type: 'twitter-auth-failure' }, '*');
    </script>
  `
  // tslint:enable: no-expression-statement
}

export const postFeedback = async (ctx: IRouterContext): Promise<any> => {
  const status = fromBody(ctx, 'status', 'string')
  const host = fromBody(ctx, 'host', 'string')
  const screenshots = extractFiles(ctx, 'screenshots')
  if (!screenshots.length) {
    throw { status: 400, message: `Request must include screenshot files` }
  }

  const user: Maybe<SerializedUser> = ctx.session?.passport?.user

  if (!user) {
    throw { status: 401 }
  }

  // Insert the host to the website table if it doesn't exist
  // or get the website ID
  // TODO - upsert!
  const [website_id]: ReadonlyArray<number> = await db('websites').select('id').where({ domain: host })

  // Insert the feedback to the feedbacks table
  const [feedback] = await db<Feedback>('feedbacks').insert({ status, user_id: user.id, website_id }).returning('*')

  // Generate feedback images data and insert them to the database
  const feedbackImageDBData: ReadonlyArray<FeedbackImageInsert> = await Promise.all(
    screenshots.map(async screenshot => {
      const FileBuffer = await readFile(screenshot.path)
      return { name: screenshot.name, file: FileBuffer, feedback_id: feedback.id }
    })
  )
  // tslint:disable-next-line: no-expression-statement
  await db<FeedbackImage>('feedback_images').insert(feedbackImageDBData)

  const params = {
    status,
    feedback_images: feedbackImageDBData.map(feedbackImage => feedbackImage.file),
    access_token: user.token,
    access_token_secret: user.tokenSecret
  }


  // TODO - persist the website per feedback
  // TODO - add tweet_url to the database object
  // TODO - cleanup and refactor

  // Write all screenshots to the current directory
  // const scrshts = await db<Screenshot>('screenshots').select('*')
  // scrshts.forEach(s => {
  //   writeFile(`./${s.name}.png`, s.screenshot_file, { encoding: 'base64' }, () => {
  //     console.log('saved')
  //   })
  // })

  const { url } = { url: 'fake' } // await twitter.tweetStatus(params)
  return Object.assign(ctx.response, { status: 201, body: { url } })
}
