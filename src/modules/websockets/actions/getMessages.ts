import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import Message from "../../messages/types/Message";
import knex from "../../../../db/knex";
import User from "../../users/types/User";

export default async (
    data: { id: number; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => {
    const messages = await knex<Message>("messages").where({
        classId: data.classid
    });
    const messageAuthors = await Promise.all(
        messages.map(l =>
            knex<User>("users")
                .where({ id: l.author })
                .first()
        )
    );
    return [
        {
            category: "messageList",
            data: [
                {
                    client: ws,
                    data: messages.map((l, idx) => ({
                        ...l,
                        author: messageAuthors[idx]
                    }))
                }
            ]
        }
    ];
};
