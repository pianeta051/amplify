import { CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
import { CustomerAddress } from "../../services/customers";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../../components/CustomerAddressForm/CustomerAddressForm";

type EditMainAddressParams = {
  id: string;
};
export const EditMainAddress: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [mainAddress, setMainAddress] = useState<CustomerAddress | null>(null);
  const { editMainAddress, getMainAddress } = useCustomers();
  const { id } = useParams<EditMainAddressParams>();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading && id) {
      getMainAddress(id)
        .then((mainAddress: CustomerAddress | null) => {
          setMainAddress(mainAddress);
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
    if (id) {
      setSubmitting(true);
      editMainAddress(id, formValues)
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
