import knex from "../../../../db/knex";
import Homework from "../types/Homework";
import Class from "../../classes/types/Class";
import userInClass from "../../users/actions/userInClass";

export default async (userid: number, classid: number) => {
    const matchingClass = await knex<Class>("classes")
        .where({ id: classid })
        .first();
    const userallowed = await userInClass(userid, classid);
    if (!matchingClass || !userallowed) {
        return null;
    }
    const homework = await knex<Homework>("homework").where({
        classid: matchingClass.id
    });
    return homework;
};
