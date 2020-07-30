import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import setUserStatus from "../../users/actions/setUserStatus";

export default (
    data: { id: number; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => setUserStatus(data.id, data.classid, "online");
