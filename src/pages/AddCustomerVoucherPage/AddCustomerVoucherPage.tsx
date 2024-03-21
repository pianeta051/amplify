import { Typography } from "@mui/material";
import { FC } from "react";

import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";

import { useNavigate, useParams } from "react-router-dom";
import {
  VoucherForm,
  VoucherFormValues,
} from "../../components/VoucherForm/VoucherForm";
import { useAddVoucher } from "../../hooks/useVoucher/useAddCustomerVoucher";
type AddCustomerVoucherParams = {
  id: string;
};
export const AddCustomerVoucherPage: FC = () => {
  const { id } = useParams<AddCustomerVoucherParams>();
  const navigate = useNavigate();
  const {
    addCustomerVoucher,
    loading: loading,
    error: error,
  } = useAddVoucher(id);

  if (!id) {
    return <ErrorAlert code={"INTERNAL_ERROR"} />;
  }

  const submitHandler = (formValues: VoucherFormValues) => {
    if (id) {
      addCustomerVoucher(formValues).then(() => {
        navigate(`/customers/${id}?tab=voucher`);
      });
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Add Voucher
      </Typography>
      {error && <ErrorAlert code={error} />}
      <VoucherForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
