import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationLayout } from "../components/AuthenticationLayout/AuthenticationLayout";
import { DashboardLayout } from "../components/DashboardLayout/DashboardLayout";
import { CreateUserPage } from "../pages/CreateUser/CreateUser";
import { ForgotPasswordPage } from "../pages/ForgotPassword/ForgotPassword";
import { LogInPage } from "../pages/LogIn/LogIn";
import { ProfilePage } from "../pages/Profile/Profile";
import { ResetPasswordPage } from "../pages/ResetPassword/ResetPassword";
import { SetPasswordPage } from "../pages/SetPassword/SetPassword";
import { UserDetails } from "../pages/Users/UserDetails";
import { UsersPage } from "../pages/Users/Users";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import { UnAuthenticatedRoute } from "./UnAuthenticateRoute";
import { AdminRoute } from "./AdminRoute";
import { CustomersPage } from "../pages/Customers/Customers";
import { CustomerDetailsPage } from "../pages/CustomerDetails/CustomerDetails";
import { CreateCustomerPage } from "../pages/CreateCustomer/CreateCustomer";

export const AppRoutes: FC = () => (
  <Routes>
    <Route
      element={
        <UnAuthenticatedRoute>
          <AuthenticationLayout />
        </UnAuthenticatedRoute>
      }
    >
      <Route index element={<LogInPage />} />
      <Route path="log-in" element={<LogInPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="set-password" element={<SetPasswordPage />} />
    </Route>

    <Route
      path="users"
      element={
        <AuthenticatedRoute>
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        </AuthenticatedRoute>
      }
    >
      <Route index element={<UsersPage />} />
      <Route path="create" element={<CreateUserPage />} />
      <Route path="me" element={<ProfilePage />} />
      <Route path=":id" element={<UserDetails />} />
    </Route>

    <Route
      path="customers"
      element={
        <AuthenticatedRoute>
          <DashboardLayout />
        </AuthenticatedRoute>
      }
    >
      <Route index element={<CustomersPage />} />
      <Route path=":id" element={<CustomerDetailsPage />} />
      <Route path="create" element={<CreateCustomerPage />} />
    </Route>
  </Routes>
);
