import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";

import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";

import { useNavigate, useParams } from "react-router-dom";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../../components/CustomerAddressForm/CustomerAddressForm";
import { useEditMainAddress } from "../../hooks/useMainAddress/useEditMainAddress";
import { useMainAddress } from "../../hooks/useMainAddress/useMainAddress";

type EditMainAddressParams = {
  id: string;
};
export const EditMainAddress: FC = () => {
  const { id } = useParams<EditMainAddressParams>();
  const {
    editMainAddress,
    loading: submitting,
    error: error,
  } = useEditMainAddress(id);
  const { mainAddress, loading } = useMainAddress(id);
  const navigate = useNavigate();

  if (!id) {
    return <ErrorAlert code={"INTERNAL_ERROR"} />;
  }
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Edit customer Address
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
  if (!mainAddress) {
    return <ErrorAlert code={"INTERNAL_ERROR"} />;
  }

  const submitHandler = (formValues: CustomerAddressFormValues) => {
    editMainAddress(formValues).then(() => {
      navigate(`/customers/${id}?tab=mainAddress`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit Address
      </Typography>
      {error && <ErrorAlert code={error} />}
      <CustomerAddressForm
        loading={submitting}
        onSubmit={submitHandler}
        defaultValues={mainAddress}
      />
    </>
  );
};
