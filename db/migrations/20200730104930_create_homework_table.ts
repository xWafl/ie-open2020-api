import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("homework", table => {
        table.increments("id");
        table.integer("classid").notNullable();
        table.string("name").notNullable();
        table.specificType("questions", "INT[]").notNullable();
        table.bigInteger("dueDate").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("homework");
};
