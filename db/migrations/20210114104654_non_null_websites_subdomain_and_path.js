exports.up = async function(knex) {
  await knex.raw(`
    UPDATE websites
    SET subdomain = ''
    WHERE subdomain IS NULL;

    UPDATE websites
    SET path = ''
    WHERE path IS NULL
  `)

  await knex.raw(`
    ALTER TABLE websites
    ALTER COLUMN subdomain SET NOT NULL;

    ALTER TABLE websites
    ALTER COLUMN path SET NOT NULL
  `)
};

exports.down = function(knex) {

};
