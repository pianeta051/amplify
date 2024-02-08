import { FC } from "react";
import { Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useCreateCustomer } from "../../hooks/useCustomer/useCreateCustomer";

export const CreateCustomerPage: FC = () => {
  const navigate = useNavigate();
  const { createCustomer, error, loading } = useCreateCustomer();
  const submitHandler = (formValues: CustomerFormValues) => {
    createCustomer(formValues).then((customer) => {
      navigate(`/customers/${customer.id}`);
    });
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {error && <ErrorAlert code={error} />}
      <CustomerForm onSubmit={submitHandler} loading={loading} />
    </>
  );
};
