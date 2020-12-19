import { identity } from 'lodash'
import * as Router from 'koa-router'
import * as send from 'koa-send'
import { readdirSync } from 'fs'
import { parse } from 'path'
import * as handlers from './handlers'



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
    .redirect('/', '/welcome')
    .use('/v1', v1Router.routes(), v1Router.allowedMethods())

  // tslint:disable-next-line:no-expression-statement
  readdirSync(process.cwd() + '/public').forEach(fileName => {
    const file = parse(fileName)
    const route = file.ext === '.html' ? file.name : fileName
    return router.get('/' + route, ctx => send(ctx, `/public/${fileName}`))
  })

  return router
}
