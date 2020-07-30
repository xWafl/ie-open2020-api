export type ResponseCategory =
    | "ping"
    | "messageSendResponse"
    | "newMessage"
    | "joinGame"
    | "switchQueueResponse"
    | "updateResponse";

export type IncomingCategory =
    | "ping"
    | "joinQueue"
    | "leaveQueue"
    | "switchQueueLocation"
    | "updateProgress";
