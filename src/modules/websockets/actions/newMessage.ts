import newMessage from "../../messages/actions/newMessage";
import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import { classes } from "../classesData";

export default async (
    data: { id: number; message: string; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => {
    const resp = await newMessage(data.id, data.message, data.classid);
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
    return [
        {
            category: "newMessage",
            data: classes[data.classid].students.map(l => ({
                client: l.ws!,
                data: resp
            }))
        }
    ];
};
