import { Role } from "./Role";

export interface RegisterBody {
    role: Role;
    name: string;
    password: string;
}
