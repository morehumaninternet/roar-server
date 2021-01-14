import db from '../db'

export type WebsiteInsert = {
  subdomain: string
  domain: string
  path: string
  twitter_handle: null | string
}

export function upsert(websites: ReadonlyArray<WebsiteInsert>): Promise<any> {
  for (const website of websites) {
    if (website.twitter_handle && !website.twitter_handle.startsWith('@')) {
      throw new Error('Twitter handle must start with a @')
    }
  }

  return db('websites').insert(websites).onConflict(['subdomain', 'domain', 'path']).merge()
}

// Gets the given website by its domain, along with any non_default_twitter_handles
export async function get(query: { hostWithoutSubdomain: string }): Promise<Website> {
  const result = await db.raw(
    `
    WITH no_subdomain_nor_path as (
      SELECT *
        FROM websites
       WHERE domain = ?
         AND subdomain = ''
         AND path = ''
    ),

    subdomain_or_path as (
      SELECT json_agg(
               json_build_object(
                 'subdomain', subdomain,
                 'path', path,
                 'twitter_handle', twitter_handle
                )
              ) as non_default_twitter_handles
        FROM websites
       WHERE domain = ?
        AND ((subdomain != '') OR (path != ''))
    )

    SELECT no_subdomain_nor_path.*
         , COALESCE(subdomain_or_path.non_default_twitter_handles, '[]'::json) as non_default_twitter_handles
      FROM no_subdomain_nor_path
      JOIN subdomain_or_path on true
    `,
    [query.hostWithoutSubdomain, query.hostWithoutSubdomain]
  )

  return result.rows[0]
}
