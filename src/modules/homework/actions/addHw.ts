import Question from "../types/Question";
import Homework from "../types/Homework";
import knex from "../../../../db/knex";
import Class from "../../classes/types/Class";

export default async (
    classid: number,
    name: string,
    dueDate: number,
    questions: Omit<Question, "id" | "homeworkid">[]
) => {
    const matchingClass = await knex<Class>("classes")
        .where({ id: classid })
        .first();
    if (!matchingClass) {
        return null;
    }
    const newHWId = (await knex("homework")).length + 1;
    await knex<Question>("questions").insert(
        questions.map(l => ({ ...l, homeworkid: newHWId }))
    );
    const dbQuestions = await knex<Question>("questions").where({
        homeworkid: newHWId
    });
    const resp = (
        await knex<Homework>("homework").insert(
            {
                classid,
                name,
                dueDate,
                questions: dbQuestions.map(l => l.id)
            },
            "*"
        )
    )[0];
    const modifiedRespQuestions = Object.entries(
        matchingClass.studentHWProgress
    )
        .map(l => {
            l[1][resp.id] = {
                completed: false,
                score: 100
            };
            return l;
        })
        .reduce((acc, cur) => {
            acc[cur[0]] = cur[1];
            return acc;
        }, {});
    await knex<Class>("classes").update({
        homework: knex.raw("array_append(homework, ?)", [resp.id]),
        studentHWProgress: modifiedRespQuestions
    });
};
