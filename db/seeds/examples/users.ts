type Role = "student" | "teacher" | "admin";

interface Users {
    name: string;
    password: string;
    role: Role;
    emailkey?: string;
}

export default [
    {
        name: "UserUser",
        password: "UserPass",
        role: "admin"
    },
    {
        name: "MKGUN3",
        password: "MaoGay",
        role: "member"
    },
    {
        name: "NotAUser",
        password: "nothing",
        role: "unverified"
    },
    {
        name: "Guy2",
        password: "JustAGuy",
        role: "member"
    }
] as readonly Users[];
