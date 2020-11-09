const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("feedbacks", (table) => {
    table.increments()
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index()
    table.string("status").notNullable()
    table.timestamps(true, true)
  })

  await addUpdateTsTrigger(knex, "feedbacks")
}

exports.down = function (knex) {
  return knex.schema.dropTable("feedbacks")
}
