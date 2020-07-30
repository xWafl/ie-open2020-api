import Router from "./Router";

import authRouter from "./auth/router";
import emailRouter from "./email/router";
import usersRouter from "./users/router";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use(authRouter);
apiRouter.use(emailRouter);
apiRouter.use(usersRouter);

export default apiRouter.routes();
