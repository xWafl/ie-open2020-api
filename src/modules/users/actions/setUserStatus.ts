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
                ...matchingClass.studentStatus,
                [userid]: status
            }
        });

    if (!classes[classid]) {
        return [];
    }

    const returning = classes[classid].students.map(l => ({
        client: l.ws!,
        data: {
            status,
            id: userid
        }
    }));
    if (classes[classid]?.teacher) {
        returning.push({
            client: classes[classid].teacher.ws!,
            data: {
                status,
                id: userid
            }
        });
    }
    return [{ category: "studentStatusUpdate", data: returning }];
};
