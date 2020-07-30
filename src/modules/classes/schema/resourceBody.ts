import Joi from "@hapi/joi";

export const resourceBody = Joi.object({
    classid: Joi.number().required(),
    name: Joi.string().required(),
    content: Joi.string().required()
});
