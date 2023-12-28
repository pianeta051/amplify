import { CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
import { Customer } from "../../services/customers";

type EditCustomerTaxDataParams = {
  id: string;
};
export const EditCustomerTaxDataPage: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { editTaxData, getCustomer } = useCustomers();
  const { id } = useParams<EditCustomerTaxDataParams>();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then((customer: Customer | null) => {
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

  if (!id) {
    return <ErrorAlert code={"INTERNAL_ERROR"} />;
  }
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
      </>
    );
  }

  const submitHandler = (formValues: TaxDataFormValues) => {
    if (id) {
      setSubmitting(true);
      editTaxData(id, formValues)
        .then(() => {
          navigate(`/customers/${id}`);
          setSubmitting(false);
        })
        .catch((error) => {
          setSubmitting(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit tax data
      </Typography>
      {error && <ErrorAlert code={error} />}
      <TaxDataForm
        loading={submitting}
        onSubmit={submitHandler}
        defaultValues={customer?.taxData}
      />
    </>
  );
};
