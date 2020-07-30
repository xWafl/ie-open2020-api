import knex from "../../../../db/knex";
import User from "../../users/types/User";

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
    await knex("classes")
        .update({
            students: knex.raw("array_append(students, ?)", [userid])
        })
        .where({ id: classid });
};
