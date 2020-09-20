const db = require("../database/config")
const { addFood, findFoodByName } = require("../foods/foods-model")

async function add(potluck) {
    const [id] = await db("potlucks").insert(potluck, "id")
    return findById(id)
}

async function update(potluck) {
    const [id] = await db("potlucks").update(potluck, "id")
    return findById(id)
}

async function addFoodToPotluck(food, id) {
   let newFood = await findFoodByName(food.name)
   if (!newFood) {
     newFood = await addFood(food)
   }

   await db("potlucks_foods").insert({food_id: newFood.id, potluck_id: id, isTaken: false})

   return db("potlucks_foods as pf")
        .innerJoin("foods as f", "f.id", "pf.food_id")
        .innerJoin("potlucks as p", "p.id", "pf.potluck_id")
        .select("p.name as potluck_name", "f.name as food_name", "pf.isTaken")
}

function find() {
    return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
}

function findBy(filter) {
	return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
		.where(filter)
}

function findById(id) {
    return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
        .where({ id })
        .first()
}

module.exports = {
    add,
    update,
    addFoodToPotluck,
	find,
	findBy,
	findById,
}