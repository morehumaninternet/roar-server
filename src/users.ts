
import { Profile as TwitterProfile } from 'passport-twitter'
import db from './db'

export function fetchUser(id: number): Promise<Maybe<User>> {
  return db<User>('users').where('id', id).first()
}

export function fetchUserByTwitterId(twitterId: string): Promise<Maybe<User>> {
  return db<User>('users').where('twitter_id', twitterId).first()
}

export async function createUserFromTwitterProfile(profile: TwitterProfile): Promise<User> {
  const [user] = await db<User>('users').insert({
    twitter_id: profile.id,
    twitter_handle: profile.username,
    display_name: profile.displayName,
    photo: profile.photos && profile.photos[0].value,
    email: profile.emails && profile.emails[0].value
  }).returning('*')

  return user
}
