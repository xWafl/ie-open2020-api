import Router from "../Router";
import joinClass from "./actions/joinClass";
import { HttpError } from "../../common/error/classes/httpError";
import joinClassByCode from "./actions/joinClassByCode";
import { requireTeacher } from "../auth/middleware/requireTeacher";
import { requireStudent } from "../auth/middleware/requireStudent";
import newClass from "./actions/newClass";

const router = new Router({ prefix: "/classes" });

router.post("/joinClass", requireStudent(), async (ctx, next) => {
    const { classId } = ctx.request.body;

    const { user } = ctx.session!;

    const resp = await joinClass(user, classId);

    if (resp === null) {
        throw new HttpError(400, "That user or class does not exist");
    }

    if (resp === false) {
        throw new HttpError(400, "You are already in that class");
    }

    ctx.status = 200;
    ctx.body = {
        message: "Successfully joined class"
    };

    await next();
});

router.post("/joinClassByCode", requireStudent(), async (ctx, next) => {
    const { code } = ctx.request.body;

    const { user } = ctx.session!;

    const resp = await joinClassByCode(user, code);

    if (resp === null) {
        throw new HttpError(400, "That user or class does not exist");
    }

    if (resp === false) {
        throw new HttpError(400, "You are already in that class");
    }

    ctx.status = 200;
    ctx.body = {
        message: "Successfully joined class"
    };

    await next();
});

router.post("/newClass", requireTeacher(), async (ctx, next) => {
    const { user } = ctx.session!;
    const { name } = ctx.request.body;
    await newClass(user, name);
    ctx.status = 201;
    ctx.body = {
        message: "Successfully made a class"
    };
    await next();
});

export default router.routes();
