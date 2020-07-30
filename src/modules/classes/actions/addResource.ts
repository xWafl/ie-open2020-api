import knex from "../../../../db/knex";
import Class from "../types/Class";
import Resource from "../types/Resource";

export default async (classid: number, name: string, content: string) => {
    const matchingClass = await knex<Class>("classes").where({ id: classid });
    if (!matchingClass) {
        return null;
    }
    return knex<Resource>("resources").insert({
        classid,
        name,
        content
    });
};
