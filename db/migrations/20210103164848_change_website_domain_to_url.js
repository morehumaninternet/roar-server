
exports.up = async function(knex) {
  await knex.raw(`
    ALTER TABLE websites
    RENAME COLUMN domain TO url
  `)
};

exports.down = async function(knex) {
  await knex.raw(`
    ALTER TABLE websites
    RENAME COLUMN url TO domain
  `)
};
