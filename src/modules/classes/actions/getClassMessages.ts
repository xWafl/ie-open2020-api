import Message from "../../messages/types/Message";
import knex from "../../../../db/knex";

export default (classId: number) => {
    return knex<Message>("messages").where({ classId });
};
