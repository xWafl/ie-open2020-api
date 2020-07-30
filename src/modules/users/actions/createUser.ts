import knex from "../../../../db/knex";
import bcrypt from "bcrypt";

import User from "../types/User";

const genNewKey = () =>
    Array(16)
        .fill(0)
        .map(() =>
            Math.random()
                .toString(36)
                .charAt(2)
        )
        .join("");

export const createUser = async (
    user: Pick<User, "name" | "password" | "role">
) => {
    const isTaken = Boolean(
        await knex<User>("users")
            .select("id")
            .where({ name: user.name || "" })
            .first()
    );
    if (isTaken) return null;
    const encryptedPassword = await bcrypt.hash(user.password, 12);
    return (
        await knex<User>("users").insert(
            {
                ...user,
                password: encryptedPassword,
                emailKey: genNewKey()
            },
            "*"
        )
    )[0];
};
