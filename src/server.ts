import * as Koa from 'koa'
import bodyParser = require('koa-body')
import * as session from 'koa-session'
const cookieParser = require('koa-cookie')
const helmet = require('koa-helmet')
import passport from './passport'
import * as middleware from './middleware'
import router from './router'


const server = new Koa()

server.proxy = true

// TODO: turn this back on?
// server.use(helmet({ noCache: true }))
// server.use(({ response }, next) => (
//   response.set('Access-Control-Allow-Methods', '*'),
//   response.set('Access-Control-Allow-Headers', 'Content-Type'),
//   response.set('Access-Control-Allow-Origin', 'http://127.0.01:5004'),
//   next()
// ))

server.use(bodyParser({ multipart: true, jsonLimit: '50mb' }))
server.use(cookieParser.default())
server.use(middleware.trackRequests)

server.keys = ['your-session-secret']

server.use(session({
  secure: true,
  sameSite: 'none',
  httpOnly: false
}, server))

server.use(passport.initialize())
server.use(passport.session())

server.use(router.routes())
server.use(router.allowedMethods())

export default server
