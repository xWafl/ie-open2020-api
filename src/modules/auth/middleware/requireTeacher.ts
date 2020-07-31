import { Middleware, DefaultState, Context } from "koa";

import { HttpError } from "../../../common/error/classes/httpError";

import User from "../../users/types/User";

import findUser from "../../users/actions/findUser";

export const requireTeacher = (): Middleware<DefaultState, Context> => async (
    ctx,
    next
) => {
    const session = ctx.session!;
    const userId: User["id"] = session.user;

    if (!session) {
        throw new HttpError(401, "You don't seem to be a teacher");
    }

    const user = await findUser("id", userId);
    if (user?.role !== "teacher") {
        throw new HttpError(401, "You don't seem to be a teacher");
    }
    ctx.session = session;

    await next();
};
