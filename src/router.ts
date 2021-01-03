import { identity } from 'lodash'
import * as Router from 'koa-router'
import * as path from 'path'
import * as send from 'koa-send'
import { readdirSync } from 'fs'
import { parse, ParsedPath } from 'path'
import * as handlers from './handlers'

declare module 'koa-router' {
  export interface IRouterContext {
    render(view: string, data?: any): any
  }
}

// Sychronously yield all files in the given directory, searching recursively
function * files(dir: string): IterableIterator<ParsedPath & { full: string }> {
  for (const name of readdirSync(path.join(__dirname, '..', dir))) {
    const parsed = parse(name)
    // Yield all files in subdirectories
    if (!parsed.ext) {
      yield * files(`${dir}/${name}`)
    } else {
      yield { ...parsed, full: `${dir}/${parsed.base}` }
    }
  }
}

export function createRouter(withRouter: (router: Router) => Router = identity): Router {

  const v1Router = withRouter(new Router())
    .get('/website', handlers.getWebsite)
    .get('/auth/twitter', handlers.authTwitter)
    .get('/auth/twitter/callback', handlers.authTwitterCallback)
    .get('/me', handlers.getMe)
    .post('/feedback', handlers.postFeedback)
    .post('/logout', handlers.logout)
    .get('/fail', () => { throw new Error('Failure!') })

  const router = new Router()
    .get(`/health-check`, ({ response }) => Object.assign(response, { status: 200, body: 'OK' }))
    .get('/', ctx => ctx.render('index'))
    .get('/welcome', ctx => ctx.render('welcome'))
    .use('/v1', v1Router.routes(), v1Router.allowedMethods())

  for (const file of files('/public')) {
    const route = file.ext === '.html' ? file.name : file.base
    router.get('/' + route, ctx => send(ctx, file.full)) // tslint:disable-line:no-expression-statement
  }

  return router
}
