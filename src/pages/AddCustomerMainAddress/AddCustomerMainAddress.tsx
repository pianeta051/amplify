import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../../components/CustomerAddressForm/CustomerAddressForm";
import { Typography } from "@mui/material";
import { useCustomers } from "../../context/CustomersContext";

type AddCustomerMainAddressParams = {
  id: string;
};

export const AddCustomerMainAddressPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id: customerId } = useParams<AddCustomerMainAddressParams>();
  const { addMainAddress } = useCustomers();
  const navigate = useNavigate();

  if (!customerId) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  const submitHandler = (formValues: CustomerAddressFormValues) => {
    setError(null);
    setLoading(true);
    addMainAddress(customerId, formValues)
      .then(() => {
        navigate(`/customers/${customerId}`);
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
