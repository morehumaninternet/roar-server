import * as passport from 'koa-passport'
import * as passportTwitter from 'passport-twitter'
import * as users from './users'


type Done<T> = (err?: any, result?: T) => void

const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar-server.herokuapp.com'
  : 'https://localhost:5004'

const callbackURL = `${host}/v1/auth/twitter/callback`

// tslint:disable-next-line: no-expression-statement
passport.serializeUser((user: User, done: Done<number>) => (console.log('passport.serializeUser', user), done(null, user.id)))

// tslint:disable-next-line: no-expression-statement
passport.deserializeUser(async (id: number, done: Done<User>) => {
  console.log('passport.deserializeUser', id)
  try {
    const user = await users.fetchUser(id)
    if (!user) {
      return done(new Error(`User not found with id ${id}`))
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
}, async (_token, _tokenSecret, profile, done: Done<User>) => {
  console.log('passportTwitter.Strategy profile', profile)
  // This function is called only when the user tries to login with Twitter.
  // The user might already exist in our database or a new user should be created.

  const user: User = await users.fetchUserByTwitterId(profile.id) || await users.createUserFromTwitterProfile(profile)

  console.log('passportTwitter.Strategy user', user)
  return done(null, user)
}))

export default passport
