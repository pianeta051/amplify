import { CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
import { Customer } from "../../services/customers";
import {
  VoucherForm,
  VoucherFormValues,
} from "../../components/VoucherForm/VoucherForm";

type EditCustomerVoucherParams = {
  id: string;
};
export const EditCustomerVoucherPage: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { editVoucher, getCustomer } = useCustomers();
  const { id } = useParams<EditCustomerVoucherParams>();
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

  const submitHandler = (formValues: VoucherFormValues) => {
    if (id) {
      setSubmitting(true);
      editVoucher(id, formValues)
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
        Edit Voucher
      </Typography>
      {error && <ErrorAlert code={error} />}
      <VoucherForm
        loading={submitting}
        onSubmit={submitHandler}
        defaultValues={customer?.voucher}
      />
    </>
  );
};
