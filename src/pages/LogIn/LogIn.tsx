import { Button, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import {
  LogInForm,
  LogInFormValues,
} from "../../components/LogInForm/LogInForm";
import { useAuth } from "../../context/AuthContext";
import { logIn as serviceLogin } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

export const LogInPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { setUser, logIn, isInGroup } = useAuth();

  const navigate = useNavigate();

  const toForgotPassword = () => navigate("/forgot-password");

  const submitHandler = (formValues: LogInFormValues) => {
    setLoading(true);
    setError(null);
    serviceLogin(formValues.email, formValues.password)
      .then((user) => {
        setLoading(false);
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          if (setUser) {
            setUser(user);
          }
          navigate("/set-password");
        } else {
          if (logIn) {
            logIn(user);
          }
          if (isInGroup("Admin")) {
            navigate("/users");
          } else {
            navigate("/customers");
          }
        }
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
        Log in
      </Typography>
      {error && <ErrorAlert code={error} />}
      <LogInForm loading={loading} onSubmit={submitHandler} />
      <Button onClick={toForgotPassword}>Forgot your password?</Button>
    </>
  );
};
