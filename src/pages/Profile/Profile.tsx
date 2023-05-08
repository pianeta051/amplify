import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ProfileName } from "../../components/ProfileName/ProfileName";
import { updateName, updatePassword } from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import {
  ProfilePassword,
  ProfilePasswordFormValues,
} from "../../components/ProfilePassword/ProfilePassword";
import { Line } from "./Profile.style";
import { useAuth } from "../../context/AuthContext";

export const ProfilePage: FC = () => {
  const [changingName, setChangingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { user, setUser } = useAuth();

  if (!user) {
    return <Error code="USER_NOT_EXISTS" />;
  }

  const changeNameHandler = (newName: string) => {
    if (user) {
      setChangingName(true);
      updateName(user, newName)
        .then((newUser) => {
          setChangingName(false);
          if (setUser) {
            setUser(newUser);
          }
        })
        .catch((error) => {
          setChangingName(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  const changePasswordHandler = ({
    oldPassword,
    newPassword,
  }: ProfilePasswordFormValues) => {
    if (user) {
      setChangingPassword(true);
      updatePassword(user, oldPassword, newPassword)
        .then(() => {
          setChangingPassword(false);
        })
        .catch((error) => {
          setChangingPassword(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  const name: string = user?.attributes?.name || "";

  return (
    <>
      <Typography variant="h3" gutterBottom>
        My Profile
      </Typography>
      {error && <Error code={error} />}
      <Box>
        <ProfileName
          name={name}
          onChange={changeNameHandler}
          loading={changingName}
        />
        <Line flexItem />
        <ProfilePassword
          onChange={changePasswordHandler}
          loading={changingPassword}
        />
      </Box>
    </>
  );
};
