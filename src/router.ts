import * as Router from 'koa-router'
import * as send from 'koa-send'
import { readdirSync } from 'fs'
import * as handlers from './handlers'

const v1Router = new Router()
  .get('/website', handlers.getWebsite)
  .get('/auth/twitter', handlers.authTwitter)
  .get('/auth/twitter/callback', handlers.authTwitterCallback)
  .get('/auth/twitter/success', handlers.authTwitterSuccess)
  .get('/auth/twitter/failure', handlers.authTwitterFailure)
  .get('/me', handlers.getMe)
  .post('/feedback', handlers.postFeedback)
  .get('/logout', handlers.logout)
  .get('/fail', () => { throw new Error('Failure!') })

const router = new Router()
  .get(`/health-check`, ({ response }) => Object.assign(response, { status: 200, body: 'OK' }))
  .redirect('/', '/docs.html')
  .use('/v1', v1Router.routes(), v1Router.allowedMethods())


// tslint:disable-next-line:no-expression-statement
readdirSync(process.cwd() + '/public').forEach(fileName =>
  router.get('/' + fileName, ctx => send(ctx, `/public/${fileName}`)))

export default router
