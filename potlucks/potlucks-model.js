const db = require("../database/config")

async function add(potluck) {
    const [id] = await db("potlucks").insert(potluck, "id")
    return findById(id)
}

async function update(potluck) {
    const [id] = await db("potlucks").update(potluck, "id")
    return findById(id)
}

async function addFoodToPotluck() {
    const [food] = await
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
	find,
	findBy,
	findById,
}