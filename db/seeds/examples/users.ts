type Role = "unverified" | "member" | "admin";

interface Users {
    name: string;
    email: string;
    password: string;
    role: Role;
    emailkey?: string;
}

export default [
    {
        name: "UserUser",
        email: "UserUser@fake.com",
        password: "UserPass",
        role: "admin"
    },
    {
        name: "MKGUN3",
        email: "Deliver@bullets.com",
        password: "MaoGay",
        role: "member"
    },
    {
        name: "NotAUser",
        email: "none@nope.com",
        password: "nothing",
        role: "unverified"
    },
    {
        name: "Guy2",
        email: "Guy2@fake.com",
        password: "JustAGuy",
        role: "member",
        description: "But hey, I have a description!"
    }
] as readonly Users[];
