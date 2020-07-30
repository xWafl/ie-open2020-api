import Router from "../Router";
import joinClass from "./actions/joinClass";
import { HttpError } from "../../common/error/classes/httpError";
import joinClassByCode from "./actions/joinClassByCode";
import { requireTeacher } from "../auth/middleware/requireTeacher";
import { requireStudent } from "../auth/middleware/requireStudent";
import newClass from "./actions/newClass";
import { validateSchema } from "../schema/middleware/validateSchema";
import { resourceBody } from "./schema/resourceBody";
import addResource from "./actions/addResource";
import { requireAuthenticated } from "../auth/middleware/requireAuthenticated";
import userInClass from "../users/actions/userInClass";
import getClassResources from "./actions/getClassResources";
import deleteResource from "./actions/deleteResource";

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

router.post(
    "/addResource",
    validateSchema(resourceBody, "body"),
    requireTeacher(),
    async (ctx, next) => {
        const { classid, name, content } = ctx.request.body;
        await addResource(classid, name, content);
        ctx.status = 200;
        ctx.body = {
            message: "Successfully added resource"
        };
        await next();
    }
);

router.get(
    "/resourcesForClass/:classid",
    requireAuthenticated(),
    async (ctx, next) => {
        const { user } = ctx.session!;
        const { classid } = ctx.params;
        if (!(await userInClass(user, classid))) {
            throw new HttpError(401, "You are not a member of that class!");
        }
        const resources = await getClassResources(classid);
        if (!resources) {
            throw new HttpError(400, "That class does not exist");
        }
        ctx.status = 200;
        ctx.body = resources;
        await next();
    }
);

router.delete("/deleteResource", requireTeacher(), async (ctx, next) => {
    const { resourceid } = ctx.request.body;
    const { user } = ctx.session!;
    const resp = await deleteResource(user, resourceid);
    if (resp === null) {
        throw new HttpError(400, "That resource does not exist");
    }
    if (resp === false) {
        throw new HttpError(400, "You're not allowed to do that");
    }
    ctx.status = 200;
    ctx.body = {
        message: "Successfully deleted resource"
    };
    await next();
});

export default router.routes();
