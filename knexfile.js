require('./env')
const pg = require('pg')

if (process.env.NODE_ENV === 'prod') {
  pg.defaults.ssl = true
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
}

const connection = process.env.DATABASE_URL || {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

module.exports = {
  client: 'pg',
  connection,
  migrations: {
    directory: __dirname + '/db/migrations'
  },
  seeds: {
    directory: __dirname + '/db/seeds'
  },
};
