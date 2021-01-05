import db from '../db'
const upsert = require('knex-upsert')


export function upsertWebsite(object: { domain: string, twitter_handle: null | string }): Promise<Website> {
  if (object.domain.startsWith('www.')) {
    throw new Error('Strip www. before creating the website')
  }

  if (object.twitter_handle && !object.twitter_handle.startsWith('@')) {
    throw new Error('Twitter handle must start with a @')
  }

  return upsert({ db, table: 'websites', object, key: 'domain' })
}
