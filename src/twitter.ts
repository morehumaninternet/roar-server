import * as Twit from 'twit'

export const tweetStatus = async (status: string, access_token: string, access_token_secret: string) => {
    const T = new Twit({
        consumer_key: process.env.TWITTER_API_KEY!,
        consumer_secret: process.env.TWITTER_KEY_SECRET!,
        access_token,
        access_token_secret,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    })

    const tweet = { status }
    const { data, resp } = await T.post('statuses/update', tweet)
    return { data, resp }
}
