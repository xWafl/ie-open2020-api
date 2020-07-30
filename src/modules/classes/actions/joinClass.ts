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

export default async (userid: number, classid: number) => {
    const user = await knex<User>("users")
        .where({ id: userid })
        .first();
    if (!user) {
        return null;
    }
    if (user.classes.includes(classid)) {
        return false;
    }
    await knex("users")
        .update({
            classes: knex.raw("array_append(classes, ?)", [classid])
        })
        .where({ id: userid });
    const matchingClass = (await knex<Class>("classes")
        .where({ id: classid })
        .first())!;
    console.log(newHWProgress(matchingClass.homework));
    await knex("classes")
        .update({
            students: knex.raw("array_append(students, ?)", [userid]),
            studentHWProgress: {
                ...matchingClass.studentHWProgress,
                userid: newHWProgress(matchingClass.homework)
            }
        })
        .where({ id: classid });
};
