import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("classes", table => {
        table.increments("id");
        table.integer("teacher").notNullable();
        table.specificType("students", "INT[]").notNullable();
        table.string("name").notNullable();
        table.string("code").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("classes");
};
