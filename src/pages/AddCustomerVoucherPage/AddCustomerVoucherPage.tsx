import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  VoucherForm,
  VoucherFormValues,
} from "../../components/VoucherForm/VoucherForm";

type AddCustomerVoucherParams = {
  id: string;
};
export const AddCustomerVoucherPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { addVoucher } = useCustomers();
  const { id } = useParams<AddCustomerVoucherParams>();
  const navigate = useNavigate();

  if (!id) {
    return <Error code={"INTERNAL_ERROR"} />;
  }

  const submitHandler = (formValues: VoucherFormValues) => {
    if (id) {
      setLoading(true);
      setError(null);
      addVoucher(id, formValues)
        .then(() => {
          navigate(`/customers/${id}`);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
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
        Add Voucher
      </Typography>
      {error && <Error code={error} />}
      <VoucherForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
