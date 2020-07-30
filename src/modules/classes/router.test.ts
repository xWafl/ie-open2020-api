import request from "supertest";

import { expect } from "chai";

import { server } from "../../";

import users from "../../../db/seeds/examples/users";
import knex from "../../../db/knex";
import Class from "./types/Class";

const agent = request.agent(server);

describe("Classes router", () => {
    it("Logs-in a user", async () => {
        const { name, password } = users[1];

        const response = await agent
            .post(`/api/auth/login`)
            .send({ username: name, password })
            .set("Accept", "application/json")
            .expect(200);

        expect(response.body).to.deep.equal({
            message: "Successfully log in",
            user: { name, role: "teacher", id: 2 }
        });
    });

    it("Joins a class by a code", async () => {
        const { code } = (await knex<Class>("classes").first())!;

        const response = await agent
            .post(`/api/classes/joinClassByCode`)
            .send({ code })
            .set("Accept", "application/json")
            .expect(200);

        expect(response.body).to.deep.equal({
            message: "Successfully joined class"
        });
    });
});
