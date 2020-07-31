import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.createTable("questions", table => {
        table.increments("id");
        table.integer("homeworkid").notNullable();
        table.string("name").notNullable();
        table.string("type").notNullable();
        table.specificType("choices", "VARCHAR(50)[]").notNullable();
        table.string("correctChoice").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("questions");
};
