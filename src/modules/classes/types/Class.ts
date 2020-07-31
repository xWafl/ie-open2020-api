import { StudentStatus } from "../../websockets/classesData";

interface StudentHWProgress {
    completed: boolean;
    score: number;
}

export default interface Class {
    id: number;
    teacher: number;
    students: number[];
    name: string;
    code: string;
    homework: number[];
    studentHWProgress: Record<number, Record<number, StudentHWProgress>>;
    studentStatus: Record<number, StudentStatus>;
}
