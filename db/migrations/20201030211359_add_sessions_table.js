const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("sessions", (table) => {
    table.increments()
    table.integer("user_id").notNullable()
    table.string("access_token").notNullable()
    table.string("access_token_secret").notNullable()
    table.timestamps(true, true)

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
  })

  await addUpdateTsTrigger(knex, "sessions")
}

exports.down = function (knex) {
  return knex.schema.dropTable("sessions")
}
