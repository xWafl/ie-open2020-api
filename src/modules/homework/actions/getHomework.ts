import Homework from "../types/Homework";
import knex from "../../../../db/knex";

export default (id: number) =>
    knex<Homework>("homework")
        .where({ id })
        .first();
