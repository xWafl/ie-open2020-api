import knex from "../../../../db/knex";
import Message from "../types/Message";

export default async (author: number, message: string, classId: number) => {
    const time = Date.now();
    await knex<Message>("messages").insert({
        author,
        message,
        classId,
        time
    });
};
