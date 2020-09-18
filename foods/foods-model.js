const db = require("../database/config")

async function addFood(food) {
    const [id] = await db("foods").insert(food, "id")
    return findById(id)
}

function findFood() {
	return db("foods").select("id", "name")
}

function findFoodByName(filter) {
	return db("foods")
		.select("id", "name")
		.where({ name })
}

function findFoodById(id) {
	return db("foods")
		.select("id", "name")
		.where({ id })
		.first()
}

module.exports = {
	addFood,
	findFood,
	findFoodByName,
	findFoodById,
}