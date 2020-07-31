import Router from "./Router";

import authRouter from "./auth/router";
import classRouter from "./classes/router";
import homeworkRouter from "./homework/router";
import usersRouter from "./users/router";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use(authRouter);
apiRouter.use(classRouter);
apiRouter.use(homeworkRouter);
apiRouter.use(usersRouter);

export default apiRouter.routes();
