if (!process.env.NODE_ENV) {
  throw new Error('Must set NODE_ENV')
}

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
