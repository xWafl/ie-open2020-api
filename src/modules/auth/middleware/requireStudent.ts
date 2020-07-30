import { Middleware, DefaultState, Context } from "koa";

import { HttpError } from "../../../common/error/classes/httpError";

import User from "../../users/types/User";

import findUser from "../../users/actions/findUser";

export const requireStudent = (): Middleware<DefaultState, Context> => async (
    ctx,
    next
) => {
    const session = ctx.session!;
    const userId: User["id"] = session.user;

    if (!session) {
        throw new HttpError(401, "You don't seem to be a student");
    }

    const user = await findUser("id", userId);

    if (user?.role !== "student") {
        throw new HttpError(401, "You don't seem to be a student");
    }
    ctx.session = session;

    await next();
};
