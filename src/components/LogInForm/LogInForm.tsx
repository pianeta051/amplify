import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export type LogInFormValues = {
  email: string;
  password: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
};

type LogInFormProps = {
  onSubmit?: (values: LogInFormValues) => void;
  loading?: boolean;
  initialValues?: LogInFormValues;
};

export const LogInForm: FC<LogInFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const submitHandler = () => {
    if (onSubmit && formValues.email.length && formValues.password.length) {
      onSubmit(formValues);
    }
  };

  const changeHandler = (value: string, key: keyof LogInFormValues) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <Form onSubmit={submitHandler}>
      <EmailInput
        value={formValues.email}
        onChange={(email) => changeHandler(email, "email")}
      />
      <PasswordInput
        value={formValues.password}
        onChange={(password) => changeHandler(password, "password")}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Log in
      </LoadingButton>
    </Form>
  );
};
