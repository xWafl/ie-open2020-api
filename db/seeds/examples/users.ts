type Role = "student" | "teacher" | "admin";

interface Users {
    name: string;
    password: string;
    role: Role;
    emailkey?: string;
    classes: number[];
}

export default [
    {
        name: "UserUser",
        password: "UserPass",
        role: "admin",
        classes: []
    },
    {
        name: "MKGUN3",
        password: "MaoGay",
        role: "member",
        classes: []
    },
    {
        name: "NotAUser",
        password: "nothing",
        role: "unverified",
        classes: []
    },
    {
        name: "Guy2",
        password: "JustAGuy",
        role: "member",
        classes: []
    }
] as readonly Users[];
