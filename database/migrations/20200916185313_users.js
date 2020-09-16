
exports.up = async function(knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments()
        table.text("name").notNullable()
        table.text("username").unique().notNullable()
        table.text("password").notNullable()
        table.text("email").unique().notNullable()
        table.text("phone").unique().notNullable()
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("users")
};
