import knex from "../../../../db/knex";
import Resource from "../types/Resource";
import User from "../../users/types/User";

export default async (userid: number, resourceid: number) => {
    const resource = await knex<Resource>("resources")
        .where({
            id: resourceid
        })
        .first();
    const user = await knex<User>("users")
        .where({ id: userid })
        .first();
    if (!resource || !user) {
        return null;
    }
    if (
        (user.classes.includes(resource.classid) && user.role === "teacher") ||
        user.role === "admin"
    ) {
        await knex<Resource>("resources")
            .delete()
            .where({ id: resourceid });
        return true;
    } else {
        return false;
    }
};
