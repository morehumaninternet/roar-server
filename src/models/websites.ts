import db from '../db'
const knexUpsert = require('knex-upsert')

export function upsert(object: { url: string; twitter_handle: null | string }): Promise<Website> {
  if (object.url.startsWith('www.')) {
    throw new Error('Strip www. before creating the website')
  }

  if (object.twitter_handle && !object.twitter_handle.startsWith('@')) {
    throw new Error('Twitter handle must start with a @')
  }

  return knexUpsert({ db, table: 'websites', object, key: 'url' })
}

export async function getBestMatching(parsedUrl: ParsedUrl): Promise<any> {
  const result = await db.raw(
    `
    SELECT twitter_handle, url from (
      SELECT websites.*, 3 as priority
        FROM websites
       WHERE url = ?

       UNION

      SELECT websites.*, 2 as priority
       FROM websites
      WHERE url = ?

      UNION

     SELECT websites.*, 1 as priority
       FROM websites
      WHERE url = ?
    ) matches
    ORDER BY priority DESC
       LIMIT 1
  `,
    [parsedUrl.fullWithFirstPath, parsedUrl.host, parsedUrl.hostWithoutSubDomain]
  )

  return result.rows[0]
}
