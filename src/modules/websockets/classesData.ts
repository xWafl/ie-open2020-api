import WebSocket from "ws";

export interface Student {
    id: number;
    ws: WebSocket;
    key: number;
}

export interface Class {
    name: string;
    teacher: Student;
    students: Student[];
}

export const classes: Record<number, Class> = {};
