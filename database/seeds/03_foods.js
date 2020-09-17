
exports.seed = async function(knex) {
	await knex("foods").insert([
		{ id: 1, name: "Hotdogs" },
    { id: 2, name: "Hamburgers" },
    { id: 3, name: "Wings" },
    { id: 4, name: "Potato Salad" },
    { id: 5, name: "Macaroni and Cheese" },
	])
}