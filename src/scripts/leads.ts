// tslint:disable:readonly-array no-expression-statement no-let
import needle = require('needle')

require('../../env.js')

const userIdsByFeedName = {
  '@NotionHQ': '708915428454576128',
  '@SlackHQ': '1305940272',
  '@Wix': '6608082',
}

const bearerToken = process.env.TWITTER_BEARER_TOKEN!

const getPage = async (feedUserId: string, nextToken?: any): any => {
  const params = { max_results: 10, expansions: 'author_id', 'user.fields': 'name' }
  if (nextToken) params.next_token = nextToken
  const url = `https://api.twitter.com/2/users/${feedUserId}/mentions`
  const resp = await needle('get', url, params, { headers: { authorization: `Bearer ${bearerToken}` } })

  if (resp.statusCode !== 200) {
    console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`)
    return
  }
  return resp.body
}

const getMentionsOfFeed = async (feedName: string) => {
  const feedUserId = userIdsByFeedName[feedName]

  let userMentions: any[] = []
  let includes: any[] = []

  let hasNextPage = true
  let nextToken = null

  console.log('Retrieving mentions...')
  while (hasNextPage) {
    let resp: any = await getPage(feedUserId, nextToken)
    if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
      if (resp.data) {
        userMentions = userMentions.concat(resp.data)
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

async function getAllMentions(): any[] {
  let allMentions: any[] = []

  for (const feedName in userIdsByFeedName) {
    allMentions = allMentions.concat(await getMentionsOfFeed(feedName))
  }

  return allMentions
}

getAllMentions().then(console.log)
