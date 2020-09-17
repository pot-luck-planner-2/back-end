
exports.seed = async function(knex) {
	await knex("potlucks_foods").insert([
		{ potluck_id: 1, food_id: 1, isTaken: true },
    { potluck_id: 1, food_id: 3, isTaken: false },
    { potluck_id: 1, food_id: 4, isTaken: true },
    { potluck_id: 2, food_id: 2, isTaken: false },
    { potluck_id: 2, food_id: 5, isTaken: true },
    { potluck_id: 2, food_id: 4, isTaken: true },
	])
}
