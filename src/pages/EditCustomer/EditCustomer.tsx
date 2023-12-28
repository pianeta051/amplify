import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { Customer } from "../../services/customers";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useCustomers } from "../../context/CustomersContext";

type EditCustomerParams = {
  id: string;
};

export const EditCustomerPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);

  const { id } = useParams<EditCustomerParams>();
  const navigate = useNavigate();
  const { getCustomer, editCustomer } = useCustomers();

  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then((customer) => {
          setCustomer(customer);
          setLoading(false);
        })
        .catch((error) => {
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, []);

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
  if (error) {
    return (
      <>
        <ErrorAlert code={error} />
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
    setEditing(true);
    setError(null);
    editCustomer(id, formValues)
      .then((customer) => {
        setEditing(false);
        navigate(`/customers/${customer.id}`);
      })
      .catch((error) => {
        setEditing(false);
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit customer
      </Typography>
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
