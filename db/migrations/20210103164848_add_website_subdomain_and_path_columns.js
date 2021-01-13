exports.up = async function(knex) {
  await knex.schema.table("websites", (table) => {
    table.dropUnique('domain')
    table.string('subdomain')
    table.string('path')
    table.unique(['subdomain', 'domain', 'path'])
  })
};

exports.down = async function(knex) {
  await knex.schema.table("websites", (table) => {
    table.dropUnique(['subdomain', 'domain', 'path'])
    table.dropColumn('subdomain')
    table.dropColumn('path')
    table.unique('domain')
  })
};
