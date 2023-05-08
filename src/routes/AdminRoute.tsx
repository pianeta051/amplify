import { FC, ReactElement } from "react";
import { useAuth } from "../context/AuthContext";
import { Error } from "../components/Error/Error";

type AdminRouteProps = {
  children: ReactElement;
};

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { isInGroup } = useAuth();
  return isInGroup("Admin") ? children : <Error code="UNAUTHORIZED" />;
};
