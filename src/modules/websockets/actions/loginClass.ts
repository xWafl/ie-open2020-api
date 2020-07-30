import WebSocket from "ws";
import HandlerResponse from "../types/HandlerResponse";
import { classes } from "../classesData";
import userInClass from "../../users/actions/userInClass";
import getClassMessages from "../../classes/actions/getClassMessages";

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
        id: data.id,
        key: genNewKey(),
        status: "online"
    });
    const censoredClass = {
        ...classes[data.classid],
        students: classes[data.classid].students.map(l => {
            const { key, ...data } = l;
            return data;
        })
    };
    return [
        {
            category: "loginClassResponse",
            data: [
                {
                    client: ws,
                    data: {
                        messages: await getClassMessages(data.classid),
                        classData: censoredClass
                    }
                }
            ]
        }
    ];
};
