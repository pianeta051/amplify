import { Alert, Button, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";

type ErrorProps = {
  code: ErrorCode;
};

export const Error: FC<ErrorProps> = ({ code }) => {
  const navigate = useNavigate();

  const toForgotPassword = () => navigate("forgot-password");

  if (code === "INCORRECT_PASSWORD") {
    return (
      <Alert severity="warning">
        <Typography>Your password is incorrect</Typography>
        <Button color="inherit" onClick={toForgotPassword}>
          Forgot your password?
        </Button>
      </Alert>
    );
  }
  if (code === "USER_NOT_EXISTS") {
    return (
      <Alert severity="warning">
        <Typography>This email is not registered</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_PASSWORD") {
    return (
      <Alert severity="warning">
        <Typography>
          Your password is not valid, please set a different one
        </Typography>
      </Alert>
    );
  }
  if (code === "DUPLICATED_USER") {
    return (
      <Alert severity="warning">
        <Typography>The email you specified is already registered</Typography>
      </Alert>
    );
  }
  if (code === "INVALID_RESET_PASSWORD_LINK") {
    return (
      <Alert severity="error">
        <Typography>This reset password link is not valid</Typography>
      </Alert>
    );
  }
  if (code === "TOO_MANY_TRIES") {
    return (
      <Alert severity="error">
        <Typography>
          You have exceeded the attempts limit. Try again in two hours
        </Typography>
      </Alert>
    );
  }
  if (code === "UNAUTHORIZED") {
    return (
      <Alert severity="error">
        <Typography>You&apos;re not authorized to see this page.</Typography>
      </Alert>
    );
  }

  return (
    <Alert severity="error">
      <Typography>Internal error</Typography>
    </Alert>
  );
};
