import knex from "../../../../db/knex";
import User from "../../users/types/User";
import Class from "../types/Class";

const newHWProgress = (homeworkids: number[]) =>
    homeworkids.reduce((acc, cur) => {
        acc[cur] = {
            completed: false,
            score: 100
        };
        return acc;
    }, {});

export default async (userid: number, code: string) => {
    const user = await knex<User>("users")
        .where({ id: userid })
        .first();
    const matchingClass = await knex<Class>("classes")
        .where({ code })
        .first();
    if (!user || !matchingClass) {
        return null;
    }
    if (user.classes.includes(matchingClass.id)) {
        return false;
    }
    await knex("users")
        .update({
            classes: knex.raw("array_append(classes, ?)", [matchingClass.id])
        })
        .where({ id: userid });
    console.log(matchingClass);
    await knex("classes")
        .update({
            students: knex.raw("array_append(students, ?)", [userid]),
            studentHWProgress: {
                ...matchingClass.studentHWProgress,
                [userid]: newHWProgress(matchingClass.homework)
            }
        })
        .where({ id: matchingClass.id });
};
