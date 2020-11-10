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
    table
      .integer("website_id")
      .notNullable()
      .references("id")
      .inTable("websites")
      .onDelete("CASCADE")
      .index()
    table.string("status").notNullable()
    table.string("tweet_url")
    table.timestamps(true, true)
  })

  await addUpdateTsTrigger(knex, "feedbacks")
}

exports.down = function (knex) {
  return knex.schema.dropTable("feedbacks")
}
