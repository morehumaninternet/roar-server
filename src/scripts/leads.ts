// tslint:disable:readonly-array no-expression-statement
import { last } from 'lodash'
import axios from 'axios'
import Twit = require('twit')

require('../../env.js')

type HackerNewsResult = {
  created_at: string
  title: string
  url: string
  author: string
}

type Tweet = {
  tweetId: number
  created_at: string
  entities: {
    hashtags: any[]
    symbols: any[]
    user_mentions: ReadonlyArray<{
      screen: string
      name: string
      id: number
      id_str: string
      indices: ReadonlyArray<number>
    }>
    urls: any[]
    media?: ReadonlyArray<{
      id: number
      id_str: String
      media_url: string
      media_url_https: string
      url: string
      display_url: string
      expanded_url: string
      type: 'photo' | string
    }>
  }
  text: string
  user: {
    id: string
    full_name: string
    handle: string
  }
}

type Mentioned = { screen_name: string; description: string; url: Maybe<string> }

const twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY!,
  consumer_secret: process.env.TWITTER_KEY_SECRET!,
  app_only_auth: true,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
})

async function* scrapeHackerNews({ page = 1 }: { page?: number } = {}): AsyncIterableIterator<HackerNewsResult> {
  const res = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?query=twitter.com&restrictSearchableAttributes=url&page=${page}`)
  yield* res.data.hits
}

async function readTweet(tweetId: string): Promise<null | Tweet> {
  try {
    const data = (await twitter.get(`/statuses/show/${tweetId}`)).data as any
    return {
      tweetId: data.id,
      created_at: data.created_at,
      entities: data.entities,
      text: data.text,
      user: {
        id: data.user.id_str,
        full_name: data.user.name,
        handle: data.user.screen_name,
      },
    }
  } catch (err) {
    if (err.statusCode !== 404) {
      console.error(err)
    }
    return null
  }
}

async function getMentioned(tweet: Tweet): Promise<Maybe<Mentioned>> {
  console.log('id_str', tweet.entities.user_mentions[0].id_str)
  try {
    const mentioned = (await twitter.get(`/users/show/${tweet.entities.user_mentions[0].id_str}`)).data as any
    const firstUrl: string = mentioned.entities?.url?.urls?.[0]?.expanded_url
    return {
      screen_name: mentioned.screen_name,
      description: mentioned.description,
      url: firstUrl,
    }
  } catch (err) {
    if (err.statusCode !== 404) {
      console.error(err)
    }
    return null
  }
}

async function* getMatchingTweetsOfPage(): AsyncIterableIterator<{ tweet: Tweet; mentioned: Mentioned }> {
  let page = 3 // tslint:disable-line:no-let
  while (true) {
    console.log(`Page #${page}`)
    for await (const result of scrapeHackerNews({ page })) {
      const tweetId = last(result.url.split('/'))
      console.log(`Tweet: ${tweetId}`)
      const tweet = await readTweet(tweetId)
      if (!tweet) continue
      const hasPhoto = tweet.entities.media?.some(media => media.type === 'photo')
      const hasMention = !!tweet.entities.user_mentions.length
      const mentioned = hasMention && (await getMentioned(tweet))

      if (mentioned && (hasPhoto || mentioned.url)) {
        yield { tweet, mentioned }
      }
    }
    page++
  }
}

async function getLeads(): Promise<void> {
  const leads = []
  for await (const lead of getMatchingTweetsOfPage()) {
    console.log(lead)
    leads.push(lead)
    if (leads.length >= 10) {
      break
    }
  }
  console.log(leads)
}

getLeads()
