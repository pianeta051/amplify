import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useCustomers } from "../../context/CustomersContext";
import { useCustomer } from "../../hooks/useCustomer";
import { useEditCustomer } from "../../hooks/useEditCustomer";

type EditCustomerParams = {
  id: string;
};

export const EditCustomerPage: FC = () => {
  const { id } = useParams<EditCustomerParams>();
  const navigate = useNavigate();
  const {
    editCustomer,
    loading: editing,
    error: errorAfterEdit,
  } = useEditCustomer(id);
  const { error: errorInitialLoad, customer, loading } = useCustomer(id);

  const backClickHandler = () => navigate(`/customers/${id}`);

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Edit customer
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (errorInitialLoad) {
    return (
      <>
        <ErrorAlert code={errorInitialLoad} />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }
  if (!customer || !id) {
    return (
      <>
        <ErrorAlert code="INTERNAL_ERROR" />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }

  const submitHandler = (formValues: CustomerFormValues) => {
    editCustomer(formValues).then((customer) => {
      navigate(`/customers/${customer.id}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit customer
      </Typography>
      {errorAfterEdit && <ErrorAlert code={errorAfterEdit} />}
      <CustomerForm
        defaultValues={customer}
        onSubmit={submitHandler}
        loading={editing}
      />
      <Button variant="contained" color="primary" onClick={backClickHandler}>
        Back
      </Button>
    </>
  );
};
