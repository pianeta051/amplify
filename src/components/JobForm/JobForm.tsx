import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JobAddressesInput } from "../JobAddressesInput/JobAddressesInput";

export type JobFormAddress = { addressId: string; customerId: string };

export type JobFormValues = {
  name: string;
  addresses: JobFormAddress[];
};

const INITIAL_VALUES: JobFormValues = {
  name: "",
  addresses: [],
};

type JobFormProps = {
  onSubmit: (values: JobFormValues) => void;
  initialValues?: JobFormValues;
  loading?: boolean;
};

const validationSchema = yup.object<JobFormValues>({
  name: yup.string().required(),
  addresses: yup
    .array()
    .of(
      yup.object<JobFormAddress>({
        addressId: yup.string().required(),
        customerId: yup.string().required(),
      })
    )
    .min(1),
});

export const JobForm: FC<JobFormProps> = ({
  onSubmit,
  initialValues = INITIAL_VALUES,
  loading,
}) => {
  const formik = useFormik<JobFormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <>
      <JobAddressesInput
        name="addresses"
        label="Addresses"
        value={formik.values.addresses}
        onChange={formik.handleChange}
        error={!!(formik.touched.addresses && formik.errors.addresses)}
        helperText={
          formik.touched.addresses
            ? (formik.errors.addresses as string)
            : undefined
        }
      />
      <Form onSubmit={formik.handleSubmit}>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          value={formik.values.name}
          margin="normal"
          onChange={formik.handleChange}
          error={!!(formik.touched.name && formik.errors.name)}
          helperText={formik.touched.name ? formik.errors.name : undefined}
        />

        <LoadingButton loading={loading} variant="outlined" type="submit">
          Submit
        </LoadingButton>
      </Form>
    </>
  );
};
