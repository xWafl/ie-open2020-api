import request from "supertest";

import { expect } from "chai";

import { server } from "../../";

import users from "../../../db/seeds/examples/users";
import knex from "../../../db/knex";

const homework = {
    classid: 1,
    name: "le amazing homework",
    dueDate: Date.now() + 3600000,
    questions: [
        {
            name: "who is gay",
            type: "choice",
            choices: ["mao", "bg", "waff", "pgsh"],
            correctChoice: "mao"
        },
        {
            name: "who is fat",
            type: "short",
            choices: [],
            correctChoice: "also mao"
        }
    ]
};

const agent = request.agent(server);

describe("Homework router", () => {
    before(async () => {
        const { name, password } = users[1];

        await agent
            .post(`/api/auth/login`)
            .send({ username: name, password })
            .set("Accept", "application/json")
            .expect(200);
    });

    it("Adds homework", async () => {
        const response = await agent
            .post(`/api/homework/addHW`)
            .send({
                classid: homework.classid,
                name: homework.name,
                dueDate: homework.dueDate,
                questions: homework.questions
            })
            .set("Accept", "application/json")
            .expect(201);

        expect(response.body).to.deep.equal({
            message: "Successfully added homework"
        });
    });

    it("Can complete homework", async () => {
        const { name, password } = users[2];
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send({ username: name, password });

        const response = await agent
            .post(`/api/homework/completeHW`)
            .send({
                homeworkid: 1,
                choices: {
                    1: "mao",
                    2: "bananya"
                }
            })
            .set("Accept", "application/json")
            .expect(200);

        expect(response.body).to.deep.equal({
            message: "You have completed an assignment! Your grade was 50"
        });
    });
});
