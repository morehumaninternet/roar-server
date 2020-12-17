
import { Profile as TwitterProfile } from 'passport-twitter'
import db from './db'
const upsert = require('knex-upsert')

export type Profile = Pick<TwitterProfile, 'id' | 'username' | 'displayName' | 'photos' | 'emails'>

export function fetchUser(id: number): Promise<Maybe<User>> {
  return db<User>('users').where('id', id).first()
}

export function fetchUserByTwitterId(twitterId: string): Promise<Maybe<User>> {
  return db<User>('users').where('twitter_id', twitterId).first()
}

function photo(profile: Profile): undefined | string {
  const firstPhoto = profile.photos?.[0]?.value
  // Don't use the default profile image from twitter
  if (firstPhoto && firstPhoto !== 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png') {
    return firstPhoto
  }
}

export function upsertWithTwitterProfile(profile: Profile): Promise<User> {
  return upsert({
    db,
    table: 'users',
    object: {
      twitter_id: profile.id,
      twitter_handle: profile.username,
      display_name: profile.displayName,
      photo: photo(profile),
      email: profile.emails && profile.emails[0]?.value
    },
    key: 'twitter_id',
  })
}
