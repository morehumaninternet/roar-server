const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("feedback_images", (table) => {
    table.increments()
    table.string("name").notNullable()
    table
      .integer("feedback_id")
      .notNullable()
      .references("id")
      .inTable("feedbacks")
      .onDelete("CASCADE")
      .index()
    table.binary("file").notNullable()
    table.timestamps(true, true)
  })

  await addUpdateTsTrigger(knex, "feedback_images")
}

exports.down = function (knex) {
  return knex.schema.dropTable("feedback_images")
}
