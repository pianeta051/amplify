import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { Error } from "../../components/Error/Error";
import { useCustomers } from "../../context/CustomersContext";
import { useNavigate, useParams } from "react-router-dom";
type AddCustomerTaxDataParams = {
  id: string;
};
export const AddCustomerTaxDataPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { addTaxData } = useCustomers();
  const { id } = useParams<AddCustomerTaxDataParams>();
  const navigate = useNavigate();

  const submitHandler = (formValues: TaxDataFormValues) => {
    if (id) {
      setLoading(true);
      addTaxData(id, formValues)
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
        Add tax data
      </Typography>
      {error && <Error code={error} />}
      <TaxDataForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
