import { FC, ReactElement } from "react";
import { useAuth } from "../context/AuthContext";
import { ErrorAlert } from "../components/ErrorAlert/ErrorAlert";

type AdminRouteProps = {
  children: ReactElement;
};

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { isInGroup } = useAuth();
  return isInGroup("Admin") ? children : <ErrorAlert code="UNAUTHORIZED" />;
};
