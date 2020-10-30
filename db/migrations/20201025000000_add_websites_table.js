const { addUpdateTsTrigger } = require("../util")

exports.up = async (knex) => {
  await knex.schema.createTable("websites", (table) => {
    table.increments()
    table.string("domain").notNullable()
    table.string("twitter_handle")
    table.timestamp("last_checked_website_html_at")
    table.timestamp("last_checked_clearbit_at")
    table.timestamps(true, true)
    table.unique("domain")
  })

  await addUpdateTsTrigger(knex, "websites")
}

exports.down = function (knex) {
  return knex.schema.dropTable("websites")
}
