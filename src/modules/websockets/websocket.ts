import WebSocket from "ws";
import categoryParser from "./middleware/categoryParser";
import HandlerResponse from "./types/HandlerResponse";
import newMessage from "./actions/newMessage";
import getMessages from "./actions/getMessages";
import loginClass from "./actions/loginClass";
import leaveClass from "./actions/leaveClass";
import setAway from "./actions/setAway";
import setOnline from "./actions/setOnline";

type WsRoutes<T> = {
    [K in keyof T]?: (
        data: T[K],
        ws: WebSocket
    ) => HandlerResponse[] | Promise<HandlerResponse[]>;
};

interface WsRoutesData {
    newMessage: { id: number; message: string; classid: number };
    getMessages: { id: number; message: string; classid: number };
    loginClass: { id: number; classid: number };
    leaveClass: { id: number; classid: number };
    setAway: { id: number; classid: number };
    setOnline: { id: number; classid: number };
}

const wsRoutes: WsRoutes<WsRoutesData> = {
    newMessage,
    getMessages,
    loginClass,
    leaveClass,
    setAway,
    setOnline
};

export default async (
    wss: WebSocket.Server,
    ws: WebSocket,
    message: string
) => {
    const { category, data } = categoryParser(message.toString());
    if (Object.keys(wsRoutes).includes(category)) {
        const response = await wsRoutes[category](data, ws);
        response.map(j => {
            console.log(j);
            const { category: respCategory } = j;
            j.data.map((l: HandlerResponse["data"][0]) => {
                if (l.client) {
                    l.client.send(
                        JSON.stringify({
                            category: respCategory,
                            data: l.data
                        })
                    );
                }
            });
        });
    }
};
