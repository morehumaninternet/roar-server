import knex = require('knex')
const config = require('../knexfile.js')

const db = knex(config)

export default db
