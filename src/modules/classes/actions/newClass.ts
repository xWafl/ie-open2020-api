import knex from "../../../../db/knex";
import Class from "../types/Class";

const genNewKey = () =>
    Array(6)
        .fill(0)
        .map(() =>
            Math.random()
                .toString(36)
                .charAt(2)
        )
        .join("");

export default (teacher: number, name: string) => {
    return knex<Class>("classes").insert({
        teacher,
        name,
        students: [],
        code: genNewKey()
    });
};
