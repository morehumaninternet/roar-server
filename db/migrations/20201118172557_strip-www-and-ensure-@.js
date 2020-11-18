exports.up = function(knex) {

  // Delete any websites with domains such as www.xyz.com if we already have xyz.com
  await knex.raw(`
    DELETE
      FROM websites
     WHERE id in (
       SELECT w1.id
        FROM websites as w1
        JOIN websites as w2 ON replace(w1.domain, 'www.', '') = w2.domain
       WHERE (lower(w1.domain) LIKE 'www.%')
     )
  `)

  // Eliminate 'www.' in all domains
  await knex.raw(`
    UPDATE websites
       SET domain = replace(domain, 'www.', '')
     WHERE (lower(domain) LIKE 'www.%')
  `)

  // Add a '@' at the start of all twitter handles that do not have them
  await knex.raw(`
    UPDATE websites
       SET twitter_handle = CONCAT('@', twitter_handle)
     WHERE twitter_handle IS NOT NULL
       AND twitter_handle NOT LIKE '@%'
  `)
}
