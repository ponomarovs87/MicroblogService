const yup = require("yup");

const postCreateSchema = yup.object({
  title: yup
    .string()
    .required("Название Обязательно")
    .min(8, "Слишком короткое название"),
  tags: yup
    .string()
    .transform((value) =>
      value
        .trim()
        .replace(/\s+/g, " ")
        .split(",")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(",")
    )
    .test(
      "is-valid-length",
      "Некорректная длина: длина каждого тега должна быть более 3х символов и менее 18ти",
      (value) => {
        if (!value) return true; 
        const tagArray = value.split(",");
        return tagArray.every(
          (tag) => tag.length > 3 && tag.length < 18
        );
      }
    ),

    markdownText: yup
    .string()
    .required("Текст обязательно")
    .min(150, "Слишком короткая статья минимум 150 знаков"),
  
});

module.exports = postCreateSchema;
