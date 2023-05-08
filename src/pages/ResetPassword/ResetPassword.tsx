import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  ResetPasswordForm,
  ResetPasswordFormValues,
} from "../../components/ResetPasswordForm/ResetPasswordForm";
import { resetPassword } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

export const ResetPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const navigate = useNavigate();

  const submitHandler = ({ password }: ResetPasswordFormValues) => {
    if (email && code) {
      setLoading(true);
      setError(null);
      resetPassword(email, code, password)
        .then(() => {
          setLoading(false);
          navigate("/log-in");
        })
        .catch((error) => {
          setLoading(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };
  return (
    <>
      {email === null || code == null ? (
        <>
          <Typography variant="h3" gutterBottom align="center">
            Invalid link
          </Typography>
          <Error code="INVALID_RESET_PASSWORD_LINK" />
        </>
      ) : (
        <>
          <Typography variant="h3" gutterBottom align="center">
            Reset your password
          </Typography>
          <Typography>Set a new password for logging in.</Typography>
          {error && <Error code={error} />}
          <ResetPasswordForm loading={loading} onSubmit={submitHandler} />
        </>
      )}
    </>
  );
};
