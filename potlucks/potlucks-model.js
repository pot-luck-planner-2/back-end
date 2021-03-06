const db = require("../database/config")
const {findUserById, findUserBy} = require("../users/users-model")


// POTLUCKS

async function addPotluck(potluck) {
    const [id] = await db("potlucks").insert(potluck, "id")
    return findPotluckById(id)
}

async function updatePotluck(id, changes) {
	await db("potlucks")
		.where({ id })
        .update(changes)
        
    return findPotluckById(id)
}

function deletePotluck(id) {
	return db("potlucks")
		.where({ id })
		.del()
}

async function addFoodToPotluck(food, id) {
   let newFood = await findFoodByName(food)
   if (newFood.length===0) {
     newFood = await addFood(food)
   }

    await db("potlucks_foods").insert({food_id: newFood.id, potluck_id: id * 1, isTaken: false})

   return db("potlucks_foods as pf")
        .innerJoin("foods as f", "f.id", "pf.food_id")
        .innerJoin("potlucks as p", "p.id", "pf.potluck_id")
        .select("p.name as potluck_name","f.id as food_id", "f.name as food_name", "pf.isTaken")
        .where({ "p.id": id })
}

async function addUserToPotluck(pid, uid) {

    await db("potlucks_users").insert({user_id: uid, potluck_id: pid, isAttending: false})
 
    return db("potlucks_users as pu")
         .innerJoin("users as u", "u.id", "pu.user_id")
         .innerJoin("potlucks as p", "p.id", "pu.potluck_id")
         .select("p.name as potluck_name", "u.name as user_name", "pu.isAttending")
         .where({ "p.id": pid })
 }

  async function updateAttending(pid, uid, changes) {
    await db("potlucks_users as pu")
    .where({"potluck_id": pid, "user_id": uid})
    .update(changes)
    

    return findPotluckGuestById(pid, uid)
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
        .where({ "p.id": id })
        .first()
}

// FOODS

async function addFood(food) {
    const [id] = await db("foods").insert(food, "id")
    return findFoodById(id)
}

async function updateTaken(pid, fid, changes) {
    await db("potlucks_foods")
        .where({"potluck_id": pid, "food_id": fid})
        .update(changes)
    return findPotluckFoodById(pid, fid)
}

function findPotluckFoodById(pid, fid) {
    ///console.log("Product id", pid)
    ///console.log("Food id", fid)
    return db("potlucks_foods as pf")
        .innerJoin("foods as f", "f.id", "pf.food_id")
        .innerJoin("potlucks as p", "p.id", "pf.potluck_id")
        .select("p.id as potluck_id", "p.name as potluck_name", "f.id as food_id", "f.name as food_name", "pf.isTaken")
        .where({"pf.potluck_id": pid, "pf.food_id": fid})
        
}

function findAllPotluckFood(pid) {
    return db("potlucks_foods as pf")
        .innerJoin("foods as f", "f.id", "pf.food_id")
        .innerJoin("potlucks as p", "p.id", "pf.potluck_id")
        .select("p.name as potluck_name", "f.name as food_name", "pf.isTaken")
        .where({"pf.potluck_id": pid})
}

function findPotluckGuestById(pid, uid) {
    return db("potlucks_users as pu")
        .innerJoin("users as u", "u.id", "pu.user_id")
        .innerJoin("potlucks as p", "p.id", "pu.potluck_id")
        .select("p.id as potluck_id", "p.name as potluck_name", "u.id as user_id", "u.name as guest_name", "pu.isAttending")
        .where({"pu.potluck_id": pid, "pu.user_id": uid})
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
    updateAttending,
	findPotlucks,
	findPotluckBy,
    findPotluckById,
    addFood,
    updateTaken,
    findPotluckFoodById,
    findAllPotluckFood,
    findPotluckGuestById,
	findFood,
	findFoodByName,
	findFoodById,
}