import { CircularProgress, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  VoucherForm,
  VoucherFormValues,
} from "../../components/VoucherForm/VoucherForm";
import { useCustomer } from "../../hooks/useCustomer";

type EditCustomerVoucherParams = {
  id: string;
};
export const EditCustomerVoucherPage: FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const { editVoucher } = useCustomers();

  const { id } = useParams<EditCustomerVoucherParams>();
  const navigate = useNavigate();

  const { customer, loading, error } = useCustomer(id);
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
        .catch(() => {
          setSubmitting(false);
          // if (isErrorCode(error.message)) {
          //   setError(error.message);
          // } else {
          //   setError("INTERNAL_ERROR");
          // }
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
