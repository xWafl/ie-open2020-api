import knex from "../../../../db/knex";
import User from "../types/User";
import Class from "../../classes/types/Class";

export default async (userid: number, classid: number) => {
    const matchingClass = await knex<Class>("classes")
        .where({ id: classid })
        .first();
    if (!matchingClass) {
        return null;
    }
    return (
        matchingClass.students.includes(userid) ||
        matchingClass.teacher === userid
    );
};
