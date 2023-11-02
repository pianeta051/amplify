import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

type TaxDataFormProps = {
  onSubmit: (values: TaxDataFormValues) => void;
  defaultValues?: TaxDataFormValues;
  loading?: boolean;
};

export type TaxDataFormValues = {
  taxId: string;
  companyName: string;
  companyAddress: string;
};

const INITIAL_VALUES: TaxDataFormValues = {
  taxId: "",
  companyName: "",
  companyAddress: "",
};

const validationSchema = yup.object<TaxDataFormValues>({
  taxId: yup.string().required(),
  companyName: yup.string().required(),
  companyAddress: yup.string().required(),
});

export const TaxDataForm: FC<TaxDataFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading = false,
}) => {
  const formik = useFormik<TaxDataFormValues>({
    initialValues: defaultValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <TextField
        label="Tax ID"
        name="taxId"
        variant="outlined"
        value={formik.values.taxId}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.taxId && formik.errors.taxId)}
        helperText={formik.touched.taxId ? formik.errors.taxId : undefined}
      />
      <TextField
        label="Company name"
        name="companyName"
        variant="outlined"
        value={formik.values.companyName}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.companyName && formik.errors.companyName)}
        helperText={
          formik.touched.companyName ? formik.errors.companyName : undefined
        }
      />
      <TextField
        label="Company address"
        name="companyAddress"
        variant="outlined"
        value={formik.values.companyAddress}
        margin="normal"
        onChange={formik.handleChange}
        error={
          !!(formik.touched.companyAddress && formik.errors.companyAddress)
        }
        helperText={
          formik.touched.companyAddress
            ? formik.errors.companyAddress
            : undefined
        }
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Save
      </LoadingButton>
    </Form>
  );
};
