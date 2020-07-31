import Question from "../types/Question";
import Homework from "../types/Homework";
import knex from "../../../../db/knex";
import Class from "../../classes/types/Class";

// const newHWProgress = (
//     hwid: number,
//     progress: Class["studentHWProgress"],
//     homeworkids: number[]
// ) => {
//     console.log(homeworkids);

//     return homeworkids.reduce((acc, cur) => {
//         acc[cur] = progress[cur] || {};
//         acc[cur][hwid] = {
//             completed: false,
//             score: 100
//         };
//         return acc;
//     }, {});
// };
export default async (
    classid: number,
    name: string,
    dueDate: number,
    questions: Omit<Question, "id" | "homeworkid">[],
    correctChoice: string
) => {
    const matchingClass = await knex<Class>("classes")
        .where({ id: classid })
        .first();
    if (!matchingClass) {
        return null;
    }
    const newHWId = (await knex("homework")).length + 1;
    await knex<Question>("questions").insert(
        questions.map(l => ({
            ...l,
            homeworkid: newHWId,
            correctChoice: correctChoice ? correctChoice : ""
        }))
    );
    const dbQuestions = await knex<Question>("questions").where({
        homeworkid: newHWId
    });

    await knex<Homework>("homework").insert(
        {
            classid,
            name,
            dueDate,
            questions: dbQuestions.map(l => l.id)
        },
        "*"
    );

    // const modifiedRespQuestions = newHWProgress(
    //     newHWId,
    //     matchingClass.studentHWProgress,
    //     matchingClass.students
    // );
    // await knex<Class>("classes").update({
    //     homework: knex.raw("array_append(homework, ?)", [resp.id]),
    //     studentHWProgress: modifiedRespQuestions
    // });
};
