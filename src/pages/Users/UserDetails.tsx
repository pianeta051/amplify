import { FC } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";

type UserDetailsParams = {
  id: string;
};

export const UserDetails: FC = () => {
  const { id } = useParams<UserDetailsParams>();
  if (!id) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }
  return <>{id}</>;
};
