// tslint:disable:no-expression-statement
import * as Koa from 'koa'
import * as Router from 'koa-router'
import bodyParser = require('koa-body')
import * as session from 'koa-session'
const cookieParser = require('koa-cookie')
import * as errorHandling from './errorHandling'
import sessionStore from './sessionStore'
import passport from './passport'
import { createRouter } from './router'

export function createServer(withRouter?: (router: Router) => Router): Koa {
  const server = errorHandling.configureServer(new Koa())

  server.proxy = true
  server.keys = [process.env.SESSION_KEY || 'keyboard-cat']

  server.use(bodyParser({ multipart: true, jsonLimit: '50mb' }))
  server.use(cookieParser.default())

  server.use(session({
    secure: process.env.NODE_ENV !== 'test',
    sameSite: 'none',
    store: sessionStore,
  }, server))

  server.use(passport.initialize())
  server.use(passport.session())

  const router = createRouter(withRouter)

  server.use(router.routes())
  server.use(router.allowedMethods())

  return server
}
