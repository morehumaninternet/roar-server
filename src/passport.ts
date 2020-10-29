import * as passport from 'koa-passport'
import * as passportTwitter from 'passport-twitter'
import db from './db'


const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar-server.herokuapp.com'
  : 'https://localhost:5004'

const callbackURL = `${host}/v1/auth/twitter/callback`

async function fetchUser(id: number): Promise<Maybe<User>> {
  return db<User>('users').where('id', id).first()
}

async function fetchUserByTwitterId(twitterId: string): Promise<Maybe<User>> {
  return db<User>('users').where('twitter_id', twitterId).first()
}

// tslint:disable-next-line: no-expression-statement
passport.serializeUser((user: User, done) => done(null, user.id))

// tslint:disable-next-line: no-expression-statement
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await fetchUser(id)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
})

// tslint:disable-next-line: no-expression-statement
passport.use(new passportTwitter.Strategy({
  callbackURL,
  consumerKey: process.env.TWITTER_API_KEY!,
  consumerSecret: process.env.TWITTER_KEY_SECRET!,
}, async (_token, _tokenSecret, profile, done) => {
  // This function is called only when the user tries to login with Twitter.
  // The user might already exist in our database or a new user should be created.

  const user = await fetchUserByTwitterId(profile.id) || (
    await db<User>('users').insert({
      twitter_id: profile.id,
      username: profile.username,
      display_name: profile.displayName,
      photo: profile.photos && profile.photos[0].value
    })
  )

  return done(null, user)
}))

export default passport
