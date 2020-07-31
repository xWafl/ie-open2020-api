import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import { classes } from "../classesData";
import Class from "../../classes/types/Class";
import userInClass from "../../users/actions/userInClass";
import getClassMessages from "../../classes/actions/getClassMessages";
import setUserStatus from "../../users/actions/setUserStatus";
import knex from "../../../../db/knex";

const genNewKey = () =>
    Number(
        Array(6)
            .fill(0)
            .map(() =>
                Math.random()
                    .toString()
                    .charAt(0)
            )
            .join("")
    );

export default async (
    data: { id: number; classid: number },
    ws: WebSocket
): Promise<HandlerResponse[]> => {
    const classData = await knex<Class>("classes")
        .where({ id: data.classid })
        .first();
    if (!classData) {
        return [
            {
                category: "loginClassResponse",
                data: [
                    {
                        client: ws,
                        data: "That class does not exist"
                    }
                ]
            }
        ];
    }
    if (!classes[data.classid]) {
        classes[data.classid] = {
            name: classData.name,
            teacher: {
                id: classData.teacher,
                ws: null
            },
            students: []
        };
    }
    if (classes[data.classid].students.map(l => l.id).includes(data.id)) {
        return [
            {
                category: "loginClassResponse",
                data: [
                    {
                        client: ws,
                        data: "You are already logged in"
                    }
                ]
            }
        ];
    }
    if (!(await userInClass(data.id, data.classid))) {
        return [
            {
                category: "loginClassResponse",
                data: [
                    {
                        client: ws,
                        data: "You are not a member of that class"
                    }
                ]
            }
        ];
    }
    if (!classes[data.classid]) {
        return [
            {
                category: "loginClassResponse",
                data: [
                    {
                        client: ws,
                        data: "That class does not exist"
                    }
                ]
            }
        ];
    }

    classes[data.classid].students.push({
        ws,
        id: data.id
    });
    return setUserStatus(data.id, data.classid, "online");
};
