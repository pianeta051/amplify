import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";

export type ForgotPasswordFormValues = {
  email: string;
};

const EMPTY_FORM = {
  email: "",
};

type ForgotPasswordFormProps = {
  onSubmit?: (values: ForgotPasswordFormValues) => void;
  loading?: boolean;
  initialValues?: ForgotPasswordFormValues;
};

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [emailErrorMessage, setEmailErrorMessage] = useState<
    string | undefined
  >();
  const validate = (formValues: ForgotPasswordFormValues) => {
    const errors: { email?: string } = {};
    if (!errors.email) {
      errors.email = "Email requiered";
    }
    if (!errors.email.includes("@")) {
      errors.email = "Invalid Email";
    }
    return errors;
  };

  const submitHandler = () => {
    const { email } = validate(formValues);
    setEmailErrorMessage(email);
    if (onSubmit && !email) {
      onSubmit(formValues);
    }
  };

  const changeHandler = (
    value: string,
    key: keyof ForgotPasswordFormValues
  ) => {
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
        errorMessage={emailErrorMessage}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Send
      </LoadingButton>
    </Form>
  );
};
