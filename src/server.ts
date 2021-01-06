// tslint:disable:no-expression-statement
import Koa = require('koa')
import * as Router from 'koa-router'
import bodyParser = require('koa-body')
import session = require('koa-session')
import cookieParser = require('koa-cookie')
import * as errorHandling from './errorHandling'
import sessionStore from './auth/sessionStore'
import passport from './auth/passport'
import { createRouter } from './router'

export function createServer(withRouter?: (router: Router) => Router): Koa {
  const server = errorHandling.configureServer(new Koa())

  server.proxy = true
  server.keys = [process.env.SESSION_KEY || 'keyboard-cat']

  // https://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect
  if (process.env.NODE_ENV === 'prod') {
    server.use((ctx, next) => {
      if (ctx.request.headers['x-forwarded-proto'] !== 'https') {
        return ctx.redirect(['https://', ctx.request.get('Host'), ctx.request.url].join(''))
      }
      return next()
    })
  }

  server.use(bodyParser({ multipart: true, jsonLimit: '50mb' }))
  server.use((cookieParser as any).default())

  server.use(
    session(
      {
        secure: process.env.NODE_ENV !== 'test',
        sameSite: 'none',
        store: sessionStore,
      },
      server
    )
  )

  server.use(passport.initialize())
  server.use(passport.session())

  const router = createRouter(withRouter)

  server.use(router.routes())
  server.use(router.allowedMethods())

  return server
}
