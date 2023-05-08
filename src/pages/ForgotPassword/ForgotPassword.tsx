import { Alert, Button, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import {
  ForgotPasswordForm,
  ForgotPasswordFormValues,
} from "../../components/ForgotPasswordForm/ForgotPasswordForm";
import { forgotPassword } from "../../services/authentication";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const toLogIn = () => navigate("/log-in");

  const submitHandler = (formValues: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    forgotPassword(formValues.email)
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Forgot your password?
      </Typography>

      {success ? (
        <Alert severity="success">
          <Typography>
            We&apos;ve sent you reset instructions via email
            <Button onClick={toLogIn} color="inherit">
              Back to log in
            </Button>
          </Typography>
        </Alert>
      ) : (
        <>
          <Typography>
            We&apos;ll send you a reset link to your email address.
          </Typography>
          {error && <Error code={error} />}
          <ForgotPasswordForm loading={loading} onSubmit={submitHandler} />
        </>
      )}
    </>
  );
};
