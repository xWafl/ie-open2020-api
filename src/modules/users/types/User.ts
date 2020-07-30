type Role = "student" | "teacher" | "admin";

type StudentStatus = "online" | "idle" | "offline";

export default interface User {
    id: number;
    name: string;
    password: string;
    role: Role;
    emailkey?: string;
    classes: number[];
    studentStatus: Record<number, StudentStatus>;
}
