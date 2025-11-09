import * as yup from "yup";

const logInSchema = yup.object().shape({
   "user-account": yup.string().trim().required().default(""),
   password: yup.string().required().min(6).default(""),
});

export {
   logInSchema,
};
