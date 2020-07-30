export type ResponseCategory =
    | "ping"
    | "messageSendResponse"
    | "newMessage"
    | "loginClassResponse"
    | "leaveClassResponse"
    | "updateResponse";

export type IncomingCategory =
    | "ping"
    | "joinQueue"
    | "leaveQueue"
    | "switchQueueLocation"
    | "updateProgress";
