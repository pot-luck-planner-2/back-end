
exports.seed = async function(knex) {
  await knex("potlucks_foods").truncate()
  await knex("potlucks_users").truncate()
  await knex("foods").truncate()
  await knex("potlucks").truncate()
  await knex("users").truncate()
}
