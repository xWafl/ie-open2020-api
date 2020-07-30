import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("messages", table => {
        table.increments("id");
        table.integer("author").notNullable();
        table.string("message").notNullable();
        table.integer("class").notNullable();
        table.bigInteger("time").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("messages");
};
