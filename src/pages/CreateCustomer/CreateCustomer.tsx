import { FC, useState } from "react";
import { Typography } from "@mui/material";
import {
  CreateCustomerForm,
  CreateCustomerFormValues,
} from "../../components/CreateCustomerForm/CreateCustomerForm";
import { createCustomer } from "../../services/customers";
import { useNavigate } from "react-router-dom";

export const CreateCustomerPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = (formValues: CreateCustomerFormValues) => {
    setLoading(true);
    createCustomer(formValues)
      .then((customer) => {
        setLoading(false);
        navigate(`/customers/${customer.id}`);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      <CreateCustomerForm onSubmit={submitHandler} loading={loading} />
    </>
  );
};
