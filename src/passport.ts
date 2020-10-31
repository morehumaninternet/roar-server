import * as passport from 'koa-passport'
import * as passportTwitter from 'passport-twitter'
import * as users from './users'

type PassportReturn = {
  dbUser: User
  token: string
  tokenSecret: string
}

const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar-server.herokuapp.com'
  : 'https://localhost:5004'

const callbackURL = `${host}/v1/auth/twitter/callback`

// tslint:disable-next-line: no-expression-statement
passport.serializeUser((user: PassportReturn, done: Done<SerializedUser>) => (
  console.log('passport.serializeUser', user),
  done(null, { id: user.dbUser.id, token: user.token, tokenSecret: user.tokenSecret })
))

// tslint:disable-next-line: no-expression-statement
passport.deserializeUser(async (serializedUser: SerializedUser, done: Done<User>) => {
  console.log('passport.deserializeUser', serializedUser)
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
}, async function(token, tokenSecret, profile, done: Done<PassportReturn>) {
  console.log('passportTwitter.Strategy', profile.id, token, tokenSecret)
  // This function is called only when the user tries to login with Twitter.
  // The user might already exist in our database or a new user should be created.

  const dbUser: User = await users.fetchUserByTwitterId(profile.id) || await users.createUserFromTwitterProfile(profile)

  return done(null, { dbUser, token, tokenSecret })
}))

export default passport
