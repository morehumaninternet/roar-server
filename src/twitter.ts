import * as Twit from 'twit'

type TweetStatusArgs = {
    status: string,
    feedback_images: ReadonlyArray<Buffer>,
    access_token: string,
    access_token_secret: string
}

type TweetResponse = {
    url: string
}

export const tweetStatus = async ({ status, feedback_images, access_token, access_token_secret }: TweetStatusArgs): Promise<TweetResponse> => {

    const T = new Twit({
        consumer_key: process.env.TWITTER_API_KEY!,
        consumer_secret: process.env.TWITTER_KEY_SECRET!,
        access_token,
        access_token_secret,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    })

    const media_ids = await Promise.all(
        feedback_images.map(async feedback_image => {
            const { data } = await T.post('media/upload', { media_data: feedback_image.toString('base64') })
            return (data as any).media_id_string
        })
    )

    const tweet = { status, media_ids }
    const { data, resp } = await T.post('statuses/update', tweet)

    if (resp.statusCode !== 200) {
        throw { status: resp.statusCode, message: resp.statusMessage }
    }

    const url = (data as any).entities?.media?.[0]?.url
    if (!url) {
        throw { status: 503, message: 'Response from twitter did not include a URL' }
    }

    return { url }
}
