import knex from "../../../../db/knex";
import Class from "../types/Class";
import User from "../../users/types/User";

const genNewKey = () =>
    Array(6)
        .fill(0)
        .map(() =>
            Math.random()
                .toString(36)
                .charAt(2)
        )
        .join("");

export default async (teacher: number, name: string) => {
    const resp = (
        await knex<Class>("classes").insert(
            {
                teacher,
                name,
                students: [teacher],
                code: genNewKey(),
                homework: [],
                studentHWProgress: {}
            },
            "*"
        )
    )[0];
    await knex<User>("users").update({
        classes: knex.raw("array_append(classes, ?)", [resp.id])
    });
    return resp;
};
