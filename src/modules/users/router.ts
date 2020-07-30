import { HttpError } from "../../common/error/classes/httpError";
import { requireAuthenticated } from "../auth/middleware/requireAuthenticated";
import Router from "../Router";
import { validateSchema } from "../schema/middleware/validateSchema";
import { createUser } from "./actions/createUser";
import getUserData from "./actions/getUserData";
import { registerBody } from "./schema/registerBody";
import { RegisterBody } from "./types/RegisterBody";
import { requireAdmin } from "../auth/middleware/requireAdmin";
import getAllUsers from "./actions/getAllUsers";
import deleteUser from "./actions/deleteUser";
import editUser from "./actions/editUser";

const router = new Router({ prefix: "/users" });

router.get("/", requireAdmin(), async (ctx, next) => {
    ctx.status = 200;
    ctx.body = await getAllUsers();
    await next();
});

router.delete("/deleteUser", requireAdmin(), async (ctx, next) => {
    const { id } = ctx.request.body;
    await deleteUser(id);
    ctx.status = 200;
    ctx.body = {
        message: "User deleted"
    };
    await next();
});

// TODO: Add schema validation for this
router.patch("/editUser", requireAdmin(), async (ctx, next) => {
    const { property, id, newValue } = ctx.request.body;
    const result = await editUser(property, id, newValue);
    if (!result) {
        ctx.status = 400;
    } else ctx.status = 200;
    await next();
});

router.post(
    "/createUser",
    validateSchema(registerBody, "body"),
    async (ctx, next) => {
        const { name, password, role } = ctx.request.body as RegisterBody;

        const user = await createUser({ role, name, password });

        if (!user) {
            throw new HttpError(400, "That username seems to be already taken");
        }

        ctx.session!.user = user.id;
        ctx.status = 201;
        ctx.body = {
            status: 201,
            message: "Successfully created",
            id: user.id
        };
        await next();
    }
);

router.get("/userData/:id", async (ctx, next) => {
    const { id } = ctx.params;

    const data = await getUserData("id", id);

    if (!data) {
        ctx.status = 404;
        return (ctx.body = { message: "That users doesn't exist." });
    }

    ctx.status = 200;
    ctx.body = data;

    await next();
});

export default router.routes();
