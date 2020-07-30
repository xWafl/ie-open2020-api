type Role = "unverified" | "member" | "admin";

export default interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: Role;
    emailKey?: string;
}
