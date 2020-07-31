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
        classes: [],
        emailkey: "blah"
    },
    {
        name: "MKGUN3",
        password: "MaoGay",
        role: "teacher",
        classes: [1],
        emailkey: "blah"
    },
    {
        name: "NotAUser",
        password: "nothing",
        role: "student",
        classes: [],
        emailkey: "blah"
    },
    {
        name: "Guy2",
        password: "JustAGuy",
        role: "student",
        classes: [],
        emailkey: "blah"
    }
] as readonly Users[];
