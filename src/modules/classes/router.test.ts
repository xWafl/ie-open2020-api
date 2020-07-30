import request from "supertest";

import { expect } from "chai";

import { server } from "../../";

import users from "../../../db/seeds/examples/users";
import knex from "../../../db/knex";
import Class from "./types/Class";

const agent = request.agent(server);

describe("Classes router", () => {
    it("Logs-in a user", async () => {
        const { name, password } = users[2];

        const response = await agent
            .post(`/api/auth/login`)
            .send({ username: name, password })
            .set("Accept", "application/json")
            .expect(200);

        expect(response.body).to.deep.equal({
            message: "Successfully log in",
            user: { name, role: "student", id: 3 }
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

    it("Cannot join class twice by a code", async () => {
        const { code } = (await knex<Class>("classes").first())!;

        const response = await agent
            .post(`/api/classes/joinClassByCode`)
            .send({ code })
            .set("Accept", "application/json")
            .expect(400);

        expect(response.body).to.deep.equal({
            status: 400,
            message: "You are already in that class"
        });
    });

    it("Cannot add resources as a student", async () => {
        const response = await agent
            .post(`/api/classes/addResource`)
            .send({ classid: 1, name: "blah", content: "resource" })
            .set("Accept", "application/json")
            .expect(401);

        expect(response.body).to.deep.equal({
            status: 401,
            message: "You don't seem to be a teacher"
        });
    });

    it("Can get all the resources", async () => {
        const response = await agent
            .get(`/api/classes/resourcesforClass/1`)
            .set("Accept", "application/json")
            .expect(200);

        expect(response.body).to.deep.equal([]);
    });

    describe("Teacher routes", async () => {
        before(async () => {
            const { name, password } = users[1];

            await agent
                .get(`/api/auth/logout`)
                .set("Accept", "application/json")
                .expect(200);

            await agent
                .post(`/api/auth/login`)
                .send({ username: name, password })
                .set("Accept", "application/json")
                .expect(200);
        });

        it("Can add a resource", async () => {
            const response = await agent
                .post(`/api/classes/addResource`)
                .send({ classid: 1, name: "blah", content: "resource" })
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body).to.deep.equal({
                message: "Successfully added resource"
            });
        });

        it("Can get all the resources", async () => {
            const response = await agent
                .get(`/api/classes/resourcesforClass/1`)
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body).to.deep.equal([
                { id: 1, classid: 1, name: "blah", content: "resource" }
            ]);
        });

        it("Can delete a resource", async () => {
            const response = await agent
                .delete(`/api/classes/deleteResource`)
                .send({ resourceid: 1 })
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body).to.deep.equal({
                message: "Successfully deleted resource"
            });
        });
    });
});
