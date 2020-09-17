
exports.seed = async function(knex) {
	await knex("potlucks").insert([
		{ id: 1, name: "My First Potluck", location: "123 Main St. Somewhere, IN 123456", date: "2020-09-30", host_id: 2 },
		{ id: 2, name: "Halloween Potluck", location: "123 Left St. Somewhere, FL 123456", date: "2020-10-31", host_id: 4 },
	])
}
