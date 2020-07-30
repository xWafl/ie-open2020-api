import Router from "../Router";
import { requireTeacher } from "../auth/middleware/requireTeacher";
import addHw from "./actions/addHw";
import { validateSchema } from "../schema/middleware/validateSchema";
import { homeworkBody } from "./schema/homeworkBody";
import { requireStudent } from "../auth/middleware/requireStudent";
import checkHwScore from "./actions/checkHwScore";
import completeHw from "./actions/completeHw";
import { HttpError } from "../../common/error/classes/httpError";

const router = new Router({ prefix: "/homework" });

router.post(
    "/addHW",
    requireTeacher(),
    validateSchema(homeworkBody, "body"),
    async (ctx, next) => {
        const { classid, name, dueDate, questions } = ctx.request.body;
        await addHw(classid, name, dueDate, questions);
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
        message: `You have completed an assignment! Your grade was ${resp.score}`
    };
    await next();
});

export default router.routes();
