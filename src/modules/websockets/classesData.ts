import WebSocket from "ws";

export type StudentStatus = "online" | "idle" | "offline";

export interface Student {
    id: number;
    ws: WebSocket;
}

export interface Class {
    name: string;
    teacher: Student;
    students: Student[];
}

export const classes: Record<number, Class> = {};
