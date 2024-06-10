const yup = require("yup");

const userCreateSchema = yup.object({
  email: yup
    .string()
    .required("email обязателен")
    .email("неправильный формат почты")
    .test(
      "is-valid-email",
      "адрес почты должен быть верно написан, например: example@mail.com",
      (value) => {
        if (!value) return false;
        const [localPart, domain] = value.split("@");
        return (
          localPart &&
          localPart.length >= 2 &&
          domain &&
          domain.includes(".")
        );
      }
    ),
  password: yup
    .string()
    .required("Поле пароль обязательно")
    .matches(
      /[a-z]/,
      "Пароль должен содержать минимум одну строчную букву"
    )
    .matches(
      /[A-Z]/,
      "Пароль должен содержать минимум одну заглавную букву"
    )
    .matches(
      /\d/,
      "Пароль должен содержать минимум одну цифру"
    )
    .matches(/^\S*$/, "Пароль не должен содержать пробелов")
    .matches(
      /^[a-zA-Z0-9]*$/,
      "Пароль должен содержать только латинские буквы и цифры"
    )
    .min(8, "Пароль должен быть не короче 8 символов"),
  name: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно состоять минимум из 2х букв")
    .transform((value) =>
      value
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(" ")
    )
    .test(
      "is-single-word",
      "Имя должно состоять из одного слова",
      (value) => !/\s/.test(value)
    ),
  surname: yup
    .string()
    .required("Фамилия обязательна")
    .min(2, "Фамилия должна состоять минимум из 2х букв")
    .transform((value) =>
      value
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(" ")
    )
    .test(
      "is-single-word",
      "Фамилия должна состоять из одного слова",
      (value) => !/\s/.test(value)
    ),
  birthDate: yup
    .string()
    .required("Дата рождения обязательна")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Дата рождения должна быть в формате 'YYYY-MM-DD'"
    )
    .test(
      "is-valid-date",
      "Дата рождения не может быть в будущем",
      (value) => {
        const date = new Date(value);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return (
          !isNaN(date.getTime()) &&
          value === date.toISOString().split("T")[0] &&
          date <= now
        );
      }
    ),
});

module.exports = userCreateSchema;
