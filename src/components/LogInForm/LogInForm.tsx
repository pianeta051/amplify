import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type LogInFormValues = {
  email: string;
  password: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
};

type LogInFormProps = {
  onSubmit: (values: LogInFormValues) => void;
  loading?: boolean;
  initialValues?: LogInFormValues;
};

const validationSchema = yup.object<LogInFormValues>({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const LogInForm: FC<LogInFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput
        value={formik.values.email}
        onChange={formik.handleChange}
        errorMessage={formik.touched.email ? formik.errors.email : undefined}
      />
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
        errorMessage={
          formik.touched.password ? formik.errors.password : undefined
        }
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Log in
      </LoadingButton>
    </Form>
  );
};
