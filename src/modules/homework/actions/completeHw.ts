import getHomework from "./getHomework";
import knex from "../../../../db/knex";
import Class from "../../classes/types/Class";
import userInClass from "../../users/actions/userInClass";
import checkHwScore from "./checkHwScore";

export default async (
    userid: number,
    homeworkid: number,
    choices: Record<number, string>
) => {
    const homework = await getHomework(homeworkid);
    if (!homework) {
        return null;
    }
    const matchingClass = (await knex<Class>("classes")
        .where({
            id: homework.classid
        })
        .first())!;
    if (!(await userInClass(userid, matchingClass.id))) {
        return null;
    }
    const score = {
        score: await checkHwScore(homeworkid, choices),
        completed: true
    };
    const updatedUserProgress = {
        ...matchingClass.studentHWProgress[userid],
        [homeworkid]: score
    };
    // I don't know why TypeScript doesn't met me do this stuff directly, but ok.
    const temp = {};
    temp[userid] = updatedUserProgress;
    await knex<Class>("classes")
        .where({
            id: matchingClass.id
        })
        .update({
            studentHWProgress: {
                ...matchingClass.studentHWProgress,
                ...temp
            }
        });
    return score;
};
