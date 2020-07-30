type Role = "student" | "teacher" | "admin";

export default interface User {
    id: number;
    name: string;
    password: string;
    role: Role;
    emailKey?: string;
    classes: number[];
}
