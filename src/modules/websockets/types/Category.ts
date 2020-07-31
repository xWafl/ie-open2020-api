export type ResponseCategory =
    | "ping"
    | "messageSendResponse"
    | "newMessage"
    | "loginClassResponse"
    | "leaveClassResponse"
    | "studentStatusUpdate"
    | "messageList";

export type IncomingCategory =
    | "ping"
    | "loginClass"
    | "leaveClass"
    | "newMessage"
    | "getMessages"
    | "setOnline"
    | "setAway";
