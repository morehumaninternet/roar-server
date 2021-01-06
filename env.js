const dotenv = require('dotenv')

if (!process.env.NODE_ENV) {
  throw new Error('Must set NODE_ENV')
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
