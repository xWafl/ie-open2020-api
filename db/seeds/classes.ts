import Knex from "knex";
import newClass from "../../src/modules/classes/actions/newClass";

export const seed = async (knex: Knex) => {
    await knex("classes").del();

    return await newClass(2, "test class");
};
