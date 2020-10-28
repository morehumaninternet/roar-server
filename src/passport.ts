import * as passport from 'koa-passport'
import * as passportTwitter from 'passport-twitter'


const host = process.env.NODE_ENV === 'prod'
  ? 'https://roar-server.herokuapp.com'
  : 'https://localhost:5004'

const callbackURL = `${host}/v1/auth/twitter/callback`

async function fetchUser(profile: any) {
  console.log('profile', profile)
  return { id: 1, username: 'test', password: 'test' }
}

passport.serializeUser(function (user: any, done) {
  console.log('passport.serializeUser')
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  console.log('passport.deserializeUser')
  try {
    const user = await fetchUser(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use(new passportTwitter.Strategy({
  callbackURL,
  consumerKey: process.env.TWITTER_API_KEY!,
  consumerSecret: process.env.TWITTER_KEY_SECRET!,
}, function (token, tokenSecret, profile, cb) {
  console.log('passportTwitter.Strategy', token, tokenSecret, profile)
  fetchUser(profile).then(user => cb(null, user))
}))

export default passport
