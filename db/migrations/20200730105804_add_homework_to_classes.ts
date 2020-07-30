import Knex from "knex";

export const up = async (knex: Knex) => {
    return knex.schema.table("classes", table => {
        table.specificType("homework", "INT[]").notNullable();
        table.jsonb("studentHWProgress").notNullable();
    });
};

export const down = async (knex: Knex) => {
    return knex.schema.table("classes", table => {
        table.dropColumn("homework");
        table.dropColumn("studentHWProgress");
    });
};
