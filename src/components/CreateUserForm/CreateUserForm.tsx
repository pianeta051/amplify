import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { useFormik } from "formik";
import * as yup from "yup";

export type CreateUserFormValues = {
  email: string;
  password: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
};
const validationSchema = yup.object<CreateUserFormValues>({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

type CreateUserFormProps = {
  onSubmit: (values: CreateUserFormValues) => void;
  loading?: boolean;
  initialValues?: CreateUserFormValues;
};

export const CreateUserForm: FC<CreateUserFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<CreateUserFormValues>({
    initialValues: initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput value={formik.values.email} onChange={formik.handleChange} />
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Create
      </LoadingButton>
    </Form>
  );
};
