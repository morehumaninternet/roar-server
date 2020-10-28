if (!process.env.NODE_ENV) {
  throw new Error('Must set NODE_ENV')
}

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

if (process.env.NODE_ENV === 'prod') {
  pg.defaults.ssl = true
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
}
