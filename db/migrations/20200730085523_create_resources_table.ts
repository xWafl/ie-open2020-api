import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("resources", table => {
        table.increments("id");
        table.integer("classid").notNullable();
        table.string("name").notNullable();
        table.string("content").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("resources");
};
