import { Handler } from './handler-type'
import * as website from './website'
import { fromBody } from './fromBody'
import { parseUrl } from '../parse-url'
import { extractFiles } from './extractFiles'
import { getCurrentUser } from './getCurrentUser'
import * as mailchimp from '../external-apis/mailchimp'
import * as twitter from '../external-apis/twitter'
import { saveFeedback, extractImageData } from '../models/feedback'

module Handlers {
  export const getWebsite = website.getWebsite

  export const getMe: Handler<{ photoUrl: null | string }> = async ctx => {
    const me = getCurrentUser(ctx)
    return { status: 200, body: { photoUrl: me.photo || null } }
  }

  export const postFeedback: Handler<{ url: string }> = async ctx => {
    const status = fromBody(ctx, 'status', 'string')

    const matchingUrl = ctx.request.body.domain || ctx.request.body.host
    if (!matchingUrl || typeof matchingUrl !== 'string') {
      throw { status: 400, message: `Body must include domain, a string` }
    }

    // Normalize the incoming url
    const parsedUrl = parseUrl(matchingUrl)

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
    await saveFeedback({ user, status, parsedUrl, imagesData, tweetUrl: url })

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
}

export = Handlers
