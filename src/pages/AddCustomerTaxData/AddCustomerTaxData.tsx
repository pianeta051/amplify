import { Typography } from "@mui/material";
import { FC } from "react";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useAddCustomerTaxData } from "../../hooks/useAddCustomerTaxData";
import { useNavigate, useParams } from "react-router-dom";

type AddCustomerTaxDataParams = {
  id: string;
};
export const AddCustomerTaxDataPage: FC = () => {
  const { id } = useParams<AddCustomerTaxDataParams>();
  const navigate = useNavigate();
  const {
    addCustomerTaxData,
    loading: loading,
    error: error,
  } = useAddCustomerTaxData(id);

  if (!id) {
    return <ErrorAlert code={"INTERNAL_ERROR"} />;
  }

  const submitHandler = (formValues: TaxDataFormValues) => {
    if (id) {
      addCustomerTaxData(formValues).then(() => {
        navigate(`/customers/${id}`);
      });
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Add tax data
      </Typography>
      {error && <ErrorAlert code={error} />}
      <TaxDataForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
