import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  VoucherForm,
  VoucherFormValues,
} from "../../components/VoucherForm/VoucherForm";
import { useCustomer } from "../../hooks/useCustomer/useCustomer";
import { useEditCustomerVoucher } from "../../hooks/useVoucher/useEditCustomerVoucher";

type EditCustomerVoucherParams = {
  id: string;
};
export const EditCustomerVoucherPage: FC = () => {
  const { id } = useParams<EditCustomerVoucherParams>();
  const {
    editCustomerVoucher,
    loading: submitting,
    error: editError,
  } = useEditCustomerVoucher(id);
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
      editCustomerVoucher(formValues).then(() => {
        navigate(`/customers/${id}?tab=voucher`);
      });
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit Voucher
      </Typography>
      {editError && <ErrorAlert code={editError} />}
      <VoucherForm
        loading={submitting}
        onSubmit={submitHandler}
        defaultValues={customer?.voucher}
      />
    </>
  );
};
