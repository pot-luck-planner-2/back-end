const db = require("../database/config")

async function addUser(user) {
	const [id] = await db("users").insert(user, "id")
	return findById(id)
}

function findUsers() {
	return db("users").select("id", "name", "username", "email", "phone")
}

function findUserBy(filter) {
	return db("users")
		.select("id", "name", "username", "password", "email", "phone")
		.where(filter)
}

function findUserById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

module.exports = {
	addUser,
	findUsers,
	findUserBy,
	findUserById,
}