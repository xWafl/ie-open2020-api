import newMessage from "../../messages/actions/newMessage";
import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import { classes } from "../classesData";
import Class from "../../classes/types/Class";
import knex from "../../../../db/knex";
import User from "../../users/types/User";

export default async (
    data: { id: number; message: string; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => {
    const classData = (await knex<Class>("classes")
        .where({ id: data.classid })
        .first())!;
    const resp = await newMessage(data.id, data.message, data.classid);
    const author = await knex<User>("users")
        .where({ id: data.id })
        .first();
    if (resp === null) {
        return [
            {
                category: "messageSendResponse",
                data: [
                    {
                        client: ws,
                        data: "You cannot send that message!"
                    }
                ]
            }
        ];
    }
    if (!classes[data.classid]) {
        classes[data.classid] = {
            name: classData.name,
            teacher: {
                id: classData.teacher,
                ws: null
            },
            students: [
                {
                    id: data.id,
                    ws: ws
                }
            ]
        };
    }
    return [
        {
            category: "newMessage",
            data: classes[data.classid].students.map(l => ({
                client: l.ws!,
                data: { ...resp, author: author!.name }
            }))
        }
    ];
};
