export type QuestionType = "choice" | "short" | "essay";

export default interface Question {
    id: number;
    homeworkid: number;
    name: string;
    type: QuestionType;
    choices: string[];
    correctChoice: string;
}
