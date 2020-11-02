import { promisify } from 'util'
import { readFile as fsReadFile } from 'fs'
import * as Twit from 'twit'
import { File } from 'formidable'

const readFile = promisify(fsReadFile)

type TweetStatusArgs = {
    status: string,
    screenshots: ReadonlyArray<File>,
    access_token: string,
    access_token_secret: string
}

type TweetResponse = {
    url: string
}

export const tweetStatus = async ({ status, screenshots, access_token, access_token_secret }: TweetStatusArgs): Promise<TweetResponse> => {

    const T = new Twit({
        consumer_key: process.env.TWITTER_API_KEY!,
        consumer_secret: process.env.TWITTER_KEY_SECRET!,
        access_token,
        access_token_secret,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    })

    const media_ids = await Promise.all(
        screenshots.map(async screenshot => {
            const options = {
                encoding: 'base64'
            }
            const base64Screenshot = await readFile(screenshot.path, options)
            const { data } = await T.post('media/upload', { media_data: base64Screenshot })
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
