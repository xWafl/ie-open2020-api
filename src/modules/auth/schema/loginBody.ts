import Joi from "@hapi/joi";

export const loginBody = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});
