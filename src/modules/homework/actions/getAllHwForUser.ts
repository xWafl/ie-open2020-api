import knex from "../../../../db/knex";
import Homework from "../types/Homework";
import User from "../../users/types/User";

export default async (userid: number) => {
    const user = await knex<User>("users")
        .where({ id: userid })
        .first();
    if (!user) {
        return null;
    }
    const homework = await knex<Homework>("homework").whereIn(
        "classid",
        user.classes
    );
    return homework;
};
