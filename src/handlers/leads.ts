// tslint:disable:readonly-array no-expression-statement no-let
import needle = require('needle')
import Router = require('koa-router')

require('../../env.js')

const userIdsByFeedName = {
  '@NotionHQ': '708915428454576128',
  '@SlackHQ': '1305940272',
  '@Wix': '6608082',
}

const bearerToken = process.env.TWITTER_BEARER_TOKEN!

const getPage = async (feedUserId: string, start_time: string, nextToken?: any): Promise<any> => {
  const params: any = { start_time, max_results: 10, expansions: 'author_id', 'user.fields': 'name', 'tweet.fields': 'created_at' }
  if (nextToken) params.pagination_token = nextToken
  const url = `https://api.twitter.com/2/users/${feedUserId}/mentions`

  const resp = await needle('get', url, params, { headers: { authorization: `Bearer ${bearerToken}` } })

  if (resp.statusCode !== 200) {
    console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`)
    return
  }
  return resp.body
}

const getMentionsOfFeed = async (feedName: keyof typeof userIdsByFeedName, start_time: string) => {
  const feedUserId = userIdsByFeedName[feedName]

  const userMentions: any[] = []
  let includes: any[] = []

  let hasNextPage = true
  let nextToken = null

  console.log('Retrieving mentions...')
  while (hasNextPage) {
    console.log(`Getting page ${feedName}...`)
    let resp: any = await getPage(feedUserId, start_time, nextToken)
    if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
      if (resp.data) {
        for (const mention of resp.data) {
          const duplicate = userMentions.find(otherMention => otherMention.id === mention.id)
          if (!duplicate) {
            userMentions.push(mention)
          }
        }
      }
      if (resp.meta.next_token) {
        nextToken = resp.meta.next_token
      }
      if (resp.includes) {
        includes = includes.concat(resp.includes.users)
      }
    } else {
      hasNextPage = false
    }
  }

  return userMentions.map(mention => {
    const { username } = includes.find(include => include.id === mention.author_id)!

    return {
      ...mention,
      username,
      feedName,
      feedUserId,
      user_href: `https://twitter.com/${username}`,
      tweet_href: `https://twitter.com/${username}/statuses/${mention.id}`,
    }
  })
}

export async function getAllMentions(ctx: Router.IRouterContext): Promise<any> {
  let start_time = ctx.query.start_time
  if (!start_time) {
    const start_date = new Date()
    start_date.setDate(start_date.getDate() - 1)
    start_time = start_date.toISOString()
  }

  console.log({ start_time })
  let allMentions: any[] = []

  for (const feedName in userIdsByFeedName) {
    allMentions = allMentions.concat(await getMentionsOfFeed(feedName as keyof typeof userIdsByFeedName, start_time))
  }

  return {
    status: 200,
    body: allMentions.map(mention => `<a href="${mention.tweet_href}">${mention.feedName} - ${mention.username}</a><br>`).join(''),
  }
}
