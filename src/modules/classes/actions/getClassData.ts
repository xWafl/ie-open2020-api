import Class from "../types/Class";
import knex from "../../../../db/knex";

export default (id: number) => {
    return knex<Class>("classes").where({ id });
};
