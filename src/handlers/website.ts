import { Handler } from './handler-type'
import { parseUrl } from '../parse-url'
import * as scrape from '../external-apis/scrape'
import * as clearbit from '../external-apis/clearbit'
import * as websites from '../models/websites'

type NonDefaultTwitterHandle = {
  subdomain: null | string
  path: null | string
  twitter_handle: string
}

type GetWebsiteResult = {
  domain: string
  twitter_handle: null | string
  non_default_twitter_handles: ReadonlyArray<NonDefaultTwitterHandle>
}

export const getWebsite: Handler<GetWebsiteResult> = async ctx => {
  const urlString: string | undefined = ctx.request.query.domain
  if (!urlString) {
    throw { status: 400, message: 'Query must include url, a string' }
  }

  const { host, hostWithoutSubdomain, subdomain, firstPath } = parseUrl(urlString)

  if (host === 'twitter.com') {
    return {
      status: 200,
      body: {
        domain: host,
        twitter_handle: firstPath ? `@${firstPath}` : '@Twitter',
        non_default_twitter_handles: [],
      },
    }
  }

  const websiteRow = await websites.get({ hostWithoutSubdomain })

  if (websiteRow) {
    return {
      status: 200,
      body: {
        domain: websiteRow.domain,
        twitter_handle: websiteRow.twitter_handle,
        non_default_twitter_handles: websiteRow.non_default_twitter_handles,
      },
    }
  }

  const scrapingSubdomainHandle = subdomain && scrape.getTwitterHandle(host)
  const domainHandle = (await scrape.getTwitterHandle(hostWithoutSubdomain)) || (await clearbit.getTwitterHandle(hostWithoutSubdomain))

  const subdomainHandle = await scrapingSubdomainHandle

  // tslint:disable: no-expression-statement readonly-array
  const non_default_twitter_handles: NonDefaultTwitterHandle[] = []
  const toInsert: websites.WebsiteInsert[] = [
    {
      subdomain: null,
      path: null,
      domain: hostWithoutSubdomain,
      twitter_handle: domainHandle || null,
    },
  ]

  if (subdomainHandle && subdomainHandle !== domainHandle) {
    non_default_twitter_handles.push({
      subdomain: subdomain!,
      path: null,
      twitter_handle: subdomainHandle,
    })

    toInsert.push({
      subdomain: subdomain!,
      path: null,
      domain: hostWithoutSubdomain,
      twitter_handle: subdomainHandle,
    })
  }

  // Insert the row no matter what
  // TODO: implement logic to scrape & try clearbit again if the last fetch was done awhile ago
  await websites.upsert(toInsert)
  // tslint:enable: no-expression-statement readonly-array

  return {
    status: 200,
    body: {
      domain: hostWithoutSubdomain,
      twitter_handle: domainHandle,
      non_default_twitter_handles,
    },
  }
}
