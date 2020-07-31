import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import Message from "../../messages/types/Message";
import knex from "../../../../db/knex";
import User from "../../users/types/User";
import { classes } from "../classesData";

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
    if (!classes[data.classid].students.map(l => l.id).includes(data.id)) {
        classes[data.classid].students.push({
            ws,
            id: data.id
        });
    }
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
