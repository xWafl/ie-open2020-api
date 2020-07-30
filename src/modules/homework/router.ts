import Router from "../Router";
import { requireTeacher } from "../auth/middleware/requireTeacher";
import addHw from "./actions/addHw";
import { validateSchema } from "../schema/middleware/validateSchema";
import { homeworkBody } from "./schema/homeworkBody";

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
export default router.routes();
