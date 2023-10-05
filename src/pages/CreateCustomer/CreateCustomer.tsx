import { FC, useState } from "react";
import { Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import { ErrorCode, isErrorCode } from "../../services/error";
import { useCustomers } from "../../context/CustomersContext";

export const CreateCustomerPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();
  const submitHandler = (formValues: CustomerFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    createCustomer(formValues)
      .then((customer) => {
        setLoading(false);
        navigate(`/customers/${customer.id}`);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("INTERNAL_ERROR");
        }
      });
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {errorMessage && <Error code={errorMessage} />}
      <CustomerForm onSubmit={submitHandler} loading={loading} />
    </>
  );
};
