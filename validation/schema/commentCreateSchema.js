const yup = require("yup");

const commentCreateSchema = yup.object({
    context: yup
    .string()
    .required("Текст обязательно")
    .min(15, "Слишком короткий комментарий минимум 15 знаков"),
});

module.exports = commentCreateSchema;
