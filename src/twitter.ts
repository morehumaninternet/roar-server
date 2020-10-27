import { parse } from 'querystring'
import * as Twit from 'twit'


const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY || '',
  consumer_secret: process.env.TWITTER_KEY_SECRET || '',
  access_token: process.env.TWITTER_ACCESS_TOKEN || '',
  access_token_secret: process.env.TWITTER_TOKEN_SECRET || '',
  timeout_ms: 60 * 1000,
  strictSSL: true,
  app_only_auth: false
})

// After a successful login, the user will be redirected to the production server or the localhost while on development/test mode.
// The 'oauth_token' and 'oauth_verifier' will be included as params in the redirected URL
// TODO - extract production server URL
const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar-server.herokuapp.com'
  : 'http://localhost:5004'

const oauth_callback = encodeURI(`${host}/v1/processtwitter`)

export async function getOauthToken() {
  return new Promise((resolve, reject) => {
    // The 'twit' package expect the callback to be 'err' object without a 'statusCode' attribute and a 'data' object.
    // Twitter sends back the 'err' object with 'statusCode' and 'data' as a string
    // tslint:disable-next-line: typedef
    return T.post('https://api.twitter.com/oauth/request_token', { oauth_callback} as any, function(err: any, data) {
      if (err && err.statusCode !== 200) {
        return reject(err)
      } else {
        return resolve(parse(data as unknown as string).oauth_token)
      }
    })
  })
}
