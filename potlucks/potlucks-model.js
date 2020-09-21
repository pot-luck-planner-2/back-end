const db = require("../database/config")
const {findUserById, findUserBy} = require("../users/users-model")


// POTLUCKS

async function addPotluck(potluck) {
    const [id] = await db("potlucks").insert(potluck, "id")
    return findPotluckById(id)
}

function updatePotluck(id, changes) {
	return db("potluck")
		.where({ id })
		.update(changes)
}

function deletePotluck(id) {
	return db("potluck")
		.where({ id })
		.del()
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

async function addUserToPotluck(user, id) {
    const newGuest = await findUserBy(user.name)
 
    await db("potlucks_users").insert({user_id: newGuest.id, potluck_id: id, isAttending: false})
 
    return db("potlucks_users as pu")
         .innerJoin("users as u", "u.id", "pu.user_id")
         .innerJoin("potlucks as p", "p.id", "pu.potluck_id")
         .select("p.name as potluck_name", "u.name as user_name", "pu.isAttending")
 }

function findPotlucks() {
    return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
}

function findPotluckBy(filter) {
	return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
		.where(filter)
}

function findPotluckById(id) {
    return db("potlucks as p")
        .innerJoin("users as u", "u.id", "p.host_id")
        .select("p.id", "p.name", "p.location", "p.date", "u.name as host_name")
        .where({ id })
        .first()
}

// FOODS

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
    addPotluck,
    updatePotluck,
    deletePotluck,
    addFoodToPotluck,
    addUserToPotluck,
	findPotlucks,
	findPotluckBy,
    findPotluckById,
    addFood,
    updateTaken,
    findPotluckFoodById,
	findFood,
	findFoodByName,
	findFoodById,
}