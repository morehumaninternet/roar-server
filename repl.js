#! /usr/bin/env node --experimental-repl-await

const repl = require('repl')
const Twit = require('twit')
const context = repl.start().context

require('./env')
context.parseUrl = require('./compiled/parse-url')
context.externalApis = {
  clearbit: require('./compiled/external-apis/clearbit'),
  scrape: require('./compiled/external-apis/scrape'),
  twitter: require('./compiled/external-apis/twitter'),
}
context.models = {
  websites: require('./compiled/models/websites'),
  feedback: require('./compiled/models/feedback'),
  users: require('./compiled/models/users'),
}
context.db = require('./compiled/db').default

context.twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_KEY_SECRET,
  app_only_auth: true,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
})
