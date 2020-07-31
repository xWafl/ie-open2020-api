import knex from "../../../../db/knex";
import Message from "../types/Message";
import userInClass from "../../users/actions/userInClass";

export default async (
    author: number,
    message: string,
    classId: number
): Promise<Message | null> => {
    const time = Date.now();
    if (!(await userInClass(Number(author), Number(classId)))) {
        return null;
    }
    return (
        await knex<Message>("messages").insert(
            {
                author,
                message,
                classId,
                time
            },
            "*"
        )
    )[0];
};
