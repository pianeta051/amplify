import { FC } from "react";
import { useParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";

type UserDetailsParams = {
  id: string;
};

export const UserDetails: FC = () => {
  const { id } = useParams<UserDetailsParams>();
  if (!id) {
    return <Error code="INTERNAL_ERROR" />;
  }
  return <>{id}</>;
};
