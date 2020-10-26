import { parse } from 'querystring'
import * as assert from 'assert'
import * as Twit from 'twit'


if (process.env.NODE_ENV !== 'test') {
    assert(process.env.TWITTER_API_KEY && process.env.TWITTER_KEY_SECRET && process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_TOKEN_SECRET)
}

const getOauthInfo = async () => {

    if (process.env.NODE_ENV === 'test') {
        throw new Error('Do not call when running tests')
      }

    const T = new Twit({
      consumer_key:         process.env.TWITTER_API_KEY || '',
      consumer_secret:      process.env.TWITTER_KEY_SECRET || '',
      access_token:         process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret:  process.env.TWITTER_TOKEN_SECRET,
      timeout_ms:           60 * 1000,  // optional HTTP request timeout to apply to all requests.
      strictSSL:            true,     // optional - requires SSL certificates to be valid.
      app_only_auth:        false
    })

    // const oauth_callback = process.env.NODE_ENV === 'dev' : "http"

    return new Promise((resolve, reject) => {
        return T.post('https://api.twitter.com/oauth/request_token', { oauth_callback: "https%3A%2F%2Fmorehumaninternet.org"} as any, function(err, data, response) {
            if (err && err.statusCode !== 200) {
                return reject(err)
            } else {
                return resolve(parse(data).oauth_token)
            }
          })
    })

}

export default getOauthInfo
