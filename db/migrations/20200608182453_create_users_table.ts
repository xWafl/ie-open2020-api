import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("users", table => {
        table.increments("id");
        table.string("name").notNullable();
        table.string("password").notNullable();
        table.string("role").notNullable();
        table.string("emailkey").notNullable();
        table.specificType("classes", "INT[]").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("users");
};
