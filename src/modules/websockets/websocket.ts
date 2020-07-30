import WebSocket from "ws";
import categoryParser from "./middleware/categoryParser";
import HandlerResponse from "./types/HandlerResponse";
import newMessage from "./actions/newMessage";
import loginClass from "./actions/loginClass";
import leaveClass from "./actions/leaveClass";

type WsRoutes<T> = {
    [K in keyof T]?: (
        data: T[K],
        ws: WebSocket
    ) => HandlerResponse[] | Promise<HandlerResponse[]>;
};

interface WsRoutesData {
    newMessage: { id: number; message: string; classid: number };
    loginClass: { id: number; classid: number };
    leaveClass: { id: number; classid: number };
    switchQueueLocation: number;
    updateProgress: {
        key: number;
        progress: number;
        wpm: number;
        rawwpm: number;
        acc: number;
    };
}

const wsRoutes: WsRoutes<WsRoutesData> = {
    newMessage,
    loginClass,
    leaveClass
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
            const { category: respCategory } = j;
            j.data.map((l: HandlerResponse["data"][0]) => {
                l.client.send(
                    JSON.stringify({
                        category: respCategory,
                        data: l.data
                    })
                );
            });
        });
    }
};
