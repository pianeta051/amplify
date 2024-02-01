import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "../../hooks/useCustomer";
import { useEditCustomerTaxData } from "../../hooks/useEditTaxData";

type EditCustomerTaxDataParams = {
  id: string;
};
export const EditCustomerTaxDataPage: FC = () => {
  const { id } = useParams<EditCustomerTaxDataParams>();
  const {
    editCustomerTaxData,
    loading: submitting,
    error: editError,
  } = useEditCustomerTaxData(id);
  const navigate = useNavigate();
  const { customer, loading, error: initialError } = useCustomer(id);

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
  if (initialError) {
    return (
      <>
        <ErrorAlert code={initialError} />
      </>
    );
  }

  const submitHandler = (formValues: TaxDataFormValues) => {
    editCustomerTaxData(formValues).then(() => {
      navigate(`/customers/${id}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit tax data
      </Typography>
      {editError && <ErrorAlert code={editError} />}
      <TaxDataForm
        loading={submitting}
        onSubmit={submitHandler}
        defaultValues={customer?.taxData}
      />
    </>
  );
};
