const { parseUrl } = require('../../compiled/parse-url')
const scrape = require('../../compiled/external-apis/scrape')
const clearbit = require('../../compiled/external-apis/clearbit')


exports.up = async function(knex) {
  const allWebsites = await knex.select('*').from('websites')

  const toInsert = []
  const toRemove = []

  for (const website of allWebsites) {
    const parsed = parseUrl(website.domain)
    if (!parsed.subdomain && !parsed.firstPath) {
      console.log(`Skipping ${website.id} ${website.domain} as it has no subdomain or path`)
      continue
    }

    const host = parsed.hostWithoutSubDomain
    const subdomain = parsed.subdomain || '*'
    const path = parsed.firstPath || '*'

    let websiteWithSameHost = allWebsites.find(website => website.domain === host)

    if (!websiteWithSameHost) {
      const twitter_handle = (await scrape.getTwitterHandle(parsed)) || (await clearbit.getTwitterHandle(host))
      if (!twitter_handle) {
        throw new Error(`${website.domain} has twitter handle ${website.twitter_handle}, but could not find one for the main host ${host}. Shutting down as not sure how to proceed`)
      }

      websiteWithSameHost = (await knex('websites').insert({ domain: host, twitter_handle }, '*'))[0]
    }

    if (websiteWithSameHost.twitter_handle !== website.twitter_handle) {
      toInsert.push({
        website_id: websiteWithSameHost.id,
        subdomain,
        path,
        twitter_handle: website.twitter_handle
      })
    }

    toRemove.push(website.id)
  }

  await knex('website_non_default_twitter_handles').insert(toInsert)
  await knex('websites').whereIn('id', toRemove).del()
};

exports.down = function(knex) {

};
