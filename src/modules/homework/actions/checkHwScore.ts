import Homework from "../types/Homework";
import knex from "../../../../db/knex";
import Question from "../types/Question";
import getHomework from "./getHomework";

export default async (homeworkid: number, choices: Record<number, string>) => {
    const hw = await getHomework(homeworkid);
    if (!hw) {
        return null;
    }
    const questions = await knex<Question>("questions").whereIn(
        "id",
        hw.questions
    );
    const successes = questions.map(l => {
        if (!choices[l.id]) {
            return false;
        }
        if (l.type === "essay") {
            return true;
        }
        return choices[l.id] === l.correctChoice;
    });
    const successRate = Math.round(
        (successes.filter(l => !!l).length / successes.length) * 100
    );
    return successRate;
};
