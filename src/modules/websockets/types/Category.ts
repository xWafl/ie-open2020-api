export type ResponseCategory =
    | "ping"
    | "messageSendResponse"
    | "newMessage"
    | "loginClassResponse"
    | "leaveClassResponse"
    | "studentStatusUpdate";

export type IncomingCategory =
    | "ping"
    | "joinQueue"
    | "leaveQueue"
    | "switchQueueLocation"
    | "updateProgress";
