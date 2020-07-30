import knex from "../../../../db/knex";
import Class from "../../classes/types/Class";
import { StudentStatus, classes } from "../../websockets/classesData";
import HandlerResponse from "../../websockets/types/HandlerResponse";

export default async (
    userid: number,
    classid: number,
    status: StudentStatus
): Promise<HandlerResponse[]> => {
    const matchingClass = await knex<Class>("classes")
        .where({ id: classid })
        .first();
    if (!matchingClass) {
        return [];
    }
    await knex<Class>("classes")
        .where({ id: classid })
        .update({
            studentStatus: {
                ...matchingClass,
                [userid]: status
            }
        })
        .first();
    return [
        {
            category: "studentStatusUpdate",
            data: [
                {
                    client: classes[classid].teacher.ws,
                    data: `A student has left the tab`
                }
            ]
        }
    ];
};