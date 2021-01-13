#! /usr/bin/env node --experimental-repl-await


const repl = require("repl")
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