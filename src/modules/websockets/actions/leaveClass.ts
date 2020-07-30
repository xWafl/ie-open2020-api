import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import { classes } from "../classesData";

export default async (
    data: { id: number; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => {
    const studentInClass = classes[data.classid].students.findIndex(
        l => l.id === data.id
    );
    if (studentInClass === -1) {
        return [];
    }
    classes[data.classid].students.splice(studentInClass, 1);
    return [
        {
            category: "leaveClassResponse",
            data: [
                {
                    client: classes[data.classid].teacher.ws,
                    data: `A student has left the class`
                }
            ]
        }
    ];
};
