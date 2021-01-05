// tslint:disable:no-expression-statement no-let
const RedisStore = require('koa-redis')

const redisOpts = process.env.REDIS_URL && { url: process.env.REDIS_URL }

const sessionStore = new RedisStore(redisOpts)

// Log errors in connecting to redis
// If we fail to make the initial connection 5 times, throw an error to exit
let retries = 0
sessionStore.on('error', (error: any) => {
  console.error(error)
  if (error.code === 'ECONNREFUSED' && error.syscall === 'connect') {
    if (++retries >= 5) {
      throw new Error(`Failed to make initial connection to redis, shutting down.`)
    }
  }
})

sessionStore.once('connect', () => console.log('Established connection to redis'))

export default sessionStore
