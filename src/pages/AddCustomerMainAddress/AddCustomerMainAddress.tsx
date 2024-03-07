import { FC } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../../components/CustomerAddressForm/CustomerAddressForm";
import { Typography } from "@mui/material";

import { useAddMainAddress } from "../../hooks/useMainAddress/useAddMainAddress";

type AddCustomerMainAddressParams = {
  id: string;
};

export const AddCustomerMainAddressPage: FC = () => {
  const { id: customerId } = useParams<AddCustomerMainAddressParams>();

  const {
    addMainAddress,
    loading: loading,
    error: error,
  } = useAddMainAddress(customerId);
  const navigate = useNavigate();

  if (!customerId) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  const submitHandler = (formValues: CustomerAddressFormValues) => {
    addMainAddress(formValues).then(() => {
      navigate(`/customers/${customerId}?tab=mainAddress`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Add main address
      </Typography>
      {error && <ErrorAlert code={error} />}
      <CustomerAddressForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
