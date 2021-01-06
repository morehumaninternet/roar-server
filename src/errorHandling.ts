// Adapted from https://docs.sentry.io/platforms/node/guides/koa/
// tslint:disable:no-expression-statement
import Koa = require('koa')
import * as Sentry from '@sentry/node'
import { extractTraceparentData, stripUrlQueryAndFragment } from '@sentry/tracing'

async function requestHandler(ctx: Koa.Context, next: () => Promise<any>): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'prod') {
      Sentry.getCurrentHub().configureScope(scope => scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request, { user: false })))
    }
    await next()
  } catch (err) {
    const status = err.status || 500
    Object.assign(ctx.response, { status, body: err.message })
    if (status >= 500) {
      console.error(err)
      ctx.app.emit('error', err, ctx)
    }
  }
}

async function tracingMiddleWare(ctx: Koa.Context, next: () => Promise<any>): Promise<void> {
  const reqMethod = (ctx.method || '').toUpperCase()
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url)

  // connect to trace of upstream app
  const sentryTrace = ctx.request.get('sentry-trace')
  const traceparentData = sentryTrace ? extractTraceparentData(sentryTrace) : {}

  const transaction = Sentry.startTransaction({
    name: `${reqMethod} ${reqUrl}`,
    op: 'http.server',
    ...traceparentData,
  })

  Object.assign(ctx, { __sentry_transaction: transaction })
  await next()

  // if using koa router, a nicer way to capture transaction using the matched route
  if ((ctx as any)._matchedRoute) {
    const mountPath = (ctx as any).mountPath || ''
    transaction.setName(`${reqMethod} ${mountPath}${(ctx as any)._matchedRoute}`)
  }
  transaction.setHttpStatus(ctx.status)
  transaction.finish()
}

export function configureServer(server: Koa): Koa {
  server.use(requestHandler)

  if (process.env.NODE_ENV === 'prod') {
    console.log('Initializing sentry...')
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 })

    server.use(tracingMiddleWare)

    server.on('error', (err, ctx) => {
      Sentry.withScope(scope => {
        scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request))
        Sentry.captureException(err)
      })
    })
  }

  return server
}
