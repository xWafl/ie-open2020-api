import Router from "../Router";
import { requireTeacher } from "../auth/middleware/requireTeacher";
import addHw from "./actions/addHw";
import { validateSchema } from "../schema/middleware/validateSchema";
import { homeworkBody } from "./schema/homeworkBody";
import { requireStudent } from "../auth/middleware/requireStudent";
import userInClass from "../users/actions/userInClass";
import completeHw from "./actions/completeHw";
import { HttpError } from "../../common/error/classes/httpError";
import getAllHwForUser from "./actions/getAllHwForUser";
import { requireAuthenticated } from "../auth/middleware/requireAuthenticated";
import getHwForClass from "./actions/getHwForClass";
import getHwQuestions from "./actions/getHwQuestions";
import knex from "../../../db/knex";
import Homework from "./types/Homework";
import Class from "../classes/types/Class";

const router = new Router({ prefix: "/homework" });

router.post(
    "/addHW",
    requireTeacher(),
    validateSchema(homeworkBody, "body"),
    async (ctx, next) => {
        const {
            classid,
            name,
            dueDate,
            questions,
            correctChoice
        } = ctx.request.body;
        await addHw(classid, name, dueDate, questions, correctChoice);
        ctx.status = 201;
        ctx.body = {
            message: "Successfully added homework"
        };
        await next();
    }
);

router.post("/completeHW", requireStudent(), async (ctx, next) => {
    const { user } = ctx.session!;
    const { homeworkid, choices } = ctx.request.body;
    const resp = await completeHw(user, homeworkid, choices);
    if (resp === null) {
        throw new HttpError(400, "You can't complete that");
    }
    ctx.status = 200;
    ctx.body = {
        message: `You have completed an assignment!`
    };
    await next();
});

router.post(
    "/completionProgressForClass",
    requireAuthenticated(),
    async (ctx, next) => {
        const { user } = ctx.session!;
        const { classid } = ctx.request.body;
        const userAllowed = await userInClass(user, classid);
        if (!userAllowed) {
            throw new HttpError(401, "You're not allowed to do that");
        }
        const classData = (await knex<Class>("classes")
            .where({ id: classid })
            .first())!;
        ctx.status = 200;
        ctx.body = classData.studentHWProgress;
    }
);

router.get("/allHWForUser", requireStudent(), async (ctx, next) => {
    const { user } = ctx.session!;
    const homework = await getAllHwForUser(user);
    if (!homework) {
        // I put this because I have no idea what happens if homework is null, that only happens if the user id is invalid
        throw new HttpError(400, "Something went wrong");
    }
    ctx.status = 200;
    ctx.body = homework;
    await next();
});

router.get(
    "/hwForClass/:classid",
    requireAuthenticated(),
    async (ctx, next) => {
        const { user } = ctx.session!;
        const { classid } = ctx.params;
        const resp = await getHwForClass(user, classid);
        if (!resp) {
            throw new HttpError(400, "You can't access that class data");
        }
        ctx.status = 200;
        ctx.body = resp;
        await next();
    }
);

router.get("/hwData/:hwId", requireAuthenticated(), async (ctx, next) => {
    const { user } = ctx.session!;
    const { hwId } = ctx.params;
    const hwForUser = await getAllHwForUser(user);
    if (!hwForUser) {
        throw new HttpError(400, "Something went wrong");
    }
    if (!hwForUser.map(l => l.id).includes(Number(hwId))) {
        throw new HttpError(400, "You don't have access to that");
    }
    const hw = hwForUser.find(l => l.id === Number(hwId))!;
    const question = await getHwQuestions(hw.id);
    console.log("question", question);

    ctx.status = 200;
    ctx.body = {
        ...hw,
        question
    };
    await next();
});

export default router.routes();
