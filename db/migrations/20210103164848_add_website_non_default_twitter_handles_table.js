const { addUpdateTsTrigger } = require("../util")

exports.up = async function(knex) {
  await knex.schema.createTable("website_non_default_twitter_handles", (table) => {
    table.increments()
    table
      .integer("website_id")
      .notNullable()
      .references("id")
      .inTable("websites")
      .onDelete("CASCADE")
      .index()
    table.string("twitter_handle").notNullable()
    table.string("subdomain").notNullable()
    table.string("path").notNullable()

    table.timestamps(true, true)
  })

  await addUpdateTsTrigger(knex, "website_non_default_twitter_handles")
};

exports.down = async function(knex) {
  return knex.schema.dropTable("website_non_default_twitter_handles")
};
