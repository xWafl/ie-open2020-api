import Joi from "@hapi/joi";

export const homeworkBody = Joi.object({
    classid: Joi.number().required(),
    name: Joi.string().required(),
    dueDate: Joi.number().required(),
    questions: Joi.array().items({
        name: Joi.string().required(),
        type: Joi.string().required(),
        choices: Joi.array().items(Joi.string().required()),
        correctChoice: Joi.string().required()
    })
});
