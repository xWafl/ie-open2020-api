import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.table("classes", table => {
        table.jsonb("studentStatus");
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.table("classes", table => {
        table.dropColumn("studentStatus");
    });
};
