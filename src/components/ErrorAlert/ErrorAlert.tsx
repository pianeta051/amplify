import { Alert, Button, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";

type ErrorAlertProps = {
  code: ErrorCode;
};

export const ErrorAlert: FC<ErrorAlertProps> = ({ code }) => {
  const navigate = useNavigate();

  const toForgotPassword = () => navigate("forgot-password");
  const toCustomers = () => navigate("/customers");

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

  if (code === "NO_CUSTOMERS") {
    return (
      <Alert severity="error">
        <Typography>No Customers in the database</Typography>
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

  if (code === "CUSTOMER_NOT_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>Customer does not exist.</Typography>
        <Button color="inherit" onClick={toCustomers}>
          Back
        </Button>
      </Alert>
    );
  }

  if (code === "EMAIL_ALREADY_EXISTS") {
    return (
      <Alert severity="error">
        <Typography>Email already exists.</Typography>
      </Alert>
    );
  }
  if (code === "EMAIL_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Email field cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "TAX_ID_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Tax ID field cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "VOUCHER_ID_CANNOT_BE_EMPTY") {
    return (
      <Alert severity="error">
        <Typography>Voucher ID field cannot be empty.</Typography>
      </Alert>
    );
  }
  if (code === "JOB_NOT_EXISTS") {
    return (
      <Alert severity="warning">
        <Typography>This Job doesn&apos;t exist or has been deleted</Typography>
      </Alert>
    );
  }

  return (
    <Alert severity="error">
      <Typography>Internal error</Typography>
    </Alert>
  );
};
