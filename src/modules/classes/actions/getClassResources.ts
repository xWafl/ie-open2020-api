import knex from "../../../../db/knex";
import Class from "../types/Class";
import Resource from "../types/Resource";

export default async (classid: number) => {
    const matchingClass = await knex<Class>("classes").where({ id: classid });
    if (!matchingClass) {
        return null;
    }
    return knex<Resource>("resources").where({ classid });
};
