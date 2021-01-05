import * as passport from 'koa-passport'
import * as passportTwitter from 'passport-twitter'
import * as users from '../models/users'


const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar.morehumaninternet.org'
  : 'https://localhost:5004'

const callbackURL = `${host}/v1/auth/twitter/callback`

// tslint:disable-next-line: no-expression-statement
passport.serializeUser((user: SerializedUser, done: Done<SerializedUser>) => done(null, user))

// tslint:disable-next-line: no-expression-statement
passport.deserializeUser(async (serializedUser: SerializedUser, done: Done<User>) => {
  try {
    const user = await users.fetchUser(serializedUser.id)
    if (!user) {
      return done(new Error(`User not found with id ${serializedUser.id}`))
    }
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
  includeEmail: true
}, async (token, tokenSecret, profile, done: Done<SerializedUser>) => {
  // This function is called only when the user tries to login with Twitter.
  // The user might already exist in our database or a new user should be created.

  const dbUser: User = await users.upsertWithTwitterProfile(profile)

  return done(null, {
    id: dbUser.id,
    photo: dbUser.photo,
    token,
    tokenSecret
  })
}))

export default passport
