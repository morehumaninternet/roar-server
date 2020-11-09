const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("screenshots", (table) => {
    table.increments()
    table.string("name").notNullable()
    table
      .integer("feedback_id")
      .notNullable()
      .references("id")
      .inTable("feedbacks")
      .onDelete("CASCADE")
      .index()
    table.binary("screenshot_file").notNullable()
    table.timestamps(true, true)
  })

  await addUpdateTsTrigger(knex, "screenshots")
}

exports.down = function (knex) {
  return knex.schema.dropTable("screenshots")
}
