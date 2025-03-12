import { Button, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { UsersTable } from "../../components/UsersTable/UsersTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers/useUsers";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";

export const UsersPage: FC = () => {
  const { users, loading, error } = useUsers();

  const navigate = useNavigate();

  if (error) {
    return <ErrorAlert code={error} />;
  }

  const toCreateUser = () => navigate("/users/create");

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Users
      </Typography>
      <Button startIcon={<AddIcon />} onClick={toCreateUser}>
        New user
      </Button>
      {loading ? <CircularProgress /> : <UsersTable users={users} />}
    </>
  );
};
