const db = require("../database/config")

async function addFood(food) {
    const [id] = await db("foods").insert(food, "id")
    return findFoodById(id)
}

async function updateTaken(potluck_id, food_id) {
    const [id] = await db("potlucks_foods").update(food, "id")
    return 

}

function findPotluckFoodById(potluck_id, food_id) {
    return db("potlucks_foods")
        .innerJoin("foods as f", "f.id", "pf.food_id")
        .innerJoin("potlucks as p", "p.id", "pf.potluck_id")
        .select("p.name as potluck_name", "f.name as food_name", "pf.isTaken")
        .where({potluck_id: potluck_id, food_id: food_id})
        .first()
}

function findFood() {
	return db("foods").select("id", "name")
}

function findFoodByName(name) {
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
    updateTaken,
    findPotluckFoodById,
	findFood,
	findFoodByName,
	findFoodById,
}