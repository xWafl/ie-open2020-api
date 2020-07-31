import knex from "../../../../db/knex";
import Class from "../types/Class";

export default async (userid: number, classid: number) => {
    await knex<Class>("classes")
        .where({ id: classid })
        .update({
            students: knex.raw("array_remove(students, ?)", [userid])
        });
};
