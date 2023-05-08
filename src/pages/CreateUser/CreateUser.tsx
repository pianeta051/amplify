import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  CreateUserForm,
  CreateUserFormValues,
} from "../../components/CreateUserForm/CreateUserForm";
import { createUser } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";

export const CreateUserPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const submitHandler = (formValues: CreateUserFormValues) => {
    setLoading(true);
    setError(null);
    createUser(formValues.email, formValues.password)
      .then(() => {
        setLoading(false);
        navigate("/users");
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
        Create user
      </Typography>
      {error && <Error code={error} />}
      <CreateUserForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
