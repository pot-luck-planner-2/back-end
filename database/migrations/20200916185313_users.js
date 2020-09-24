exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments();
    table.text("name").notNull();
    table.text("username").unique().notNull();
    table.text("password").notNull();
    table.text("email").unique().notNull();
    table.text("phone").unique().notNull();
  });

  await knex.schema.createTable("potlucks", (table) => {
    table.increments();
    table.text("name").notNull();
    table.text("location").notNull();
    table.date("date").notNull();
    table
      .integer("host_id")
      .notNull()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("foods", (table) => {
    table.increments();
    table.text("name").notNull().unique();
  });

  await knex.schema.createTable("potlucks_users", (table) => {
    table
      .integer("potluck_id")
      .notNull()
      .references("id")
      .inTable("potlucks")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("user_id").notNull().references("id").inTable("users");
    table.boolean("isAttending").notNull().defaultTo("false");

    table.primary(["potluck_id", "user_id"]);
  });

  await knex.schema.createTable("potlucks_foods", (table) => {
    table
      .integer("potluck_id")
      .notNull()
      .references("id")
      .inTable("potlucks")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("food_id").notNull().references("id").inTable("foods");
    table.boolean("isTaken").notNull().defaultTo("false");

    table.primary(["potluck_id", "food_id"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("potlucks_foods");
  await knex.schema.dropTableIfExists("potlucks_users");
  await knex.schema.dropTableIfExists("foods");
  await knex.schema.dropTableIfExists("potlucks");
  await knex.schema.dropTableIfExists("users");
};
