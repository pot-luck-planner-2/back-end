
exports.seed = async function(knex) {
	await knex("potlucks_users").insert([
		{ potluck_id: 1, user_id: 3, isAttending: true },
    { potluck_id: 1, user_id: 4, isAttending: false },
    { potluck_id: 1, user_id: 1, isAttending: true },
    { potluck_id: 2, user_id: 2, isAttending: false },
    { potluck_id: 2, user_id: 3, isAttending: true },
    { potluck_id: 2, user_id: 1, isAttending: true },
	])
}
