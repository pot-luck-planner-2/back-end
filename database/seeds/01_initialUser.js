
// hashed password for abc12345
const hashedPassword = "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6"

exports.seed = async function(knex) {
	await knex("users").insert([
		{ id: 1, name: "admin", username: "admin", password: hashedPassword, email: "admin@admin.com", phone: 9999999999 },
		{ id: 2, name: "John Doe", username: "johndoe", password: hashedPassword, email: "john@john.com", phone: 8888888888 },
	])
}
