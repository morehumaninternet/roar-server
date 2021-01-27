import { identity } from 'lodash'
import Router = require('koa-router')
import * as path from 'path'
import send = require('koa-send')
import { readdirSync } from 'fs'
import { parse, ParsedPath } from 'path'
import passport from './auth/passport'
import * as handlers from './handlers'

declare module 'koa-router' {
  export interface IRouterContext {
    render(view: string, data?: any): any
  }
}

type MappedHandlers = {
  [key in keyof typeof handlers]: (ctx: Router.IRouterContext) => Promise<any>
}

const mappedHandlers: MappedHandlers = Object.keys(handlers).reduce((mh: MappedHandlers, key: keyof typeof handlers) => {
  const handler = handlers[key]
  return {
    [key]: async (ctx: Router.IRouterContext) => Object.assign(ctx.response, await handler(ctx)),
    ...mh,
  }
}, {} as MappedHandlers)

// Sychronously yield all files in the given directory, searching recursively
// tslint:disable-next-line:readonly-array
function* files(...dirs: string[]): IterableIterator<ParsedPath & { full: string }> {
  for (const dir of dirs) {
    for (const name of readdirSync(path.join(__dirname, '..', dir))) {
      const parsed = parse(name)
      // Yield all files in subdirectories
      if (!parsed.ext) {
        yield* files(`${dir}/${name}`)
      } else {
        yield { ...parsed, full: `${dir}/${parsed.base}` }
      }
    }
  }
}

export function createRouter(withRouter: (router: Router) => Router = identity): Router {
  const v1Router = withRouter(new Router())
    .get('/website', mappedHandlers.getWebsite)
    // Redirect the user to Twitter for authentication. When complete, Twitter
    // will redirect the user back to the application at
    // /auth/twitter/callback
    .get('/auth/twitter', passport.authenticate('twitter'))
    // Twitter will redirect the user to this URL after approval. Finish the
    // authentication process by attempting to obtain an access token. If
    // access was granted, the user will be logged in. Otherwise,
    // authentication has failed.
    .get(
      '/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect: '/auth-success',
        failureRedirect: '/welcome',
      })
    )
    .get('/me', mappedHandlers.getMe)
    .post('/feedback', mappedHandlers.postFeedback)
    .post('/logout', mappedHandlers.logout)
    .post('/subscribe', mappedHandlers.subscribe)
    .get('/leads', mappedHandlers.leads)
    .get('/spy', mappedHandlers.spy)
    .get('/fail', () => {
      throw new Error('Failure!')
    })

  const router = new Router()
    .get(`/health-check`, ({ response }) => Object.assign(response, { status: 200, body: 'OK' }))
    .use('/v1', v1Router.routes(), v1Router.allowedMethods())

  for (const file of files('/public', '/css', '/html')) {
    const route = file.base === 'index.html' ? '' : file.ext === '.html' ? file.name : file.base
    router.get('/' + route, ctx => send(ctx, file.full)) // tslint:disable-line:no-expression-statement
  }

  return router
}
