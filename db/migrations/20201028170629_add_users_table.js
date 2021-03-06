const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments()
    table.string("twitter_id").notNullable()
    table.string("twitter_handle").notNullable()
    table.string("display_name").notNullable()
    table.string("email")
    table.string("photo")
    table.timestamps(true, true)
    table.unique("twitter_id")
  })

  await addUpdateTsTrigger(knex, "users")
}

exports.down = function (knex) {
  return knex.schema.dropTable("users")
}
