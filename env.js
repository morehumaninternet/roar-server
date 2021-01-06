const dotenv = require('dotenv')

if (!process.env.NODE_ENV) {
  throw new Error('Must set NODE_ENV')
}

if (process.env.NODE_ENV !== 'prod') {
  dotenv.config({ path: `.default.env` })
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
