import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export type ResetPasswordFormValues = {
  password: string;
};

const EMPTY_FORM = {
  password: "",
};

type ResetPasswordFormProps = {
  onSubmit?: (values: ResetPasswordFormValues) => void;
  loading?: boolean;
  initialValues?: ResetPasswordFormValues;
};

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const submitHandler = () => {
    if (onSubmit && formValues.password.length) {
      onSubmit(formValues);
    }
  };

  const changeHandler = (value: string, key: keyof ResetPasswordFormValues) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <Form onSubmit={submitHandler}>
      <PasswordInput
        value={formValues.password}
        onChange={(password) => changeHandler(password, "password")}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Change password
      </LoadingButton>
    </Form>
  );
};
