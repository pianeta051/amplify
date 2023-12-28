import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export type CustomerAddressFormValues = {
  street: string;
  number: string;
  city: string;
  postcode: string;
};

type CustomerAddressFormProps = {
  onSubmit: (values: CustomerAddressFormValues) => void;
  defaultValues?: CustomerAddressFormValues;
  loading?: boolean;
};

const INITIAL_VALUES: CustomerAddressFormValues = {
  street: "",
  number: "",
  city: "",
  postcode: "",
};

const validationSchema = yup.object<CustomerAddressFormValues>({
  street: yup.string().required(),
  number: yup.string().required(),
  city: yup.string().required(),
  postcode: yup.string().required(),
});

export const CustomerAddressForm: FC<CustomerAddressFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading = false,
}) => {
  const formik = useFormik<CustomerAddressFormValues>({
    initialValues: defaultValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <TextField
        label="Street"
        name="street"
        variant="outlined"
        value={formik.values.street}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.street && formik.errors.street)}
        helperText={formik.touched.street ? formik.errors.street : undefined}
      />
      <TextField
        label="Number"
        name="number"
        variant="outlined"
        value={formik.values.number}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.number && formik.errors.number)}
        helperText={formik.touched.number ? formik.errors.number : undefined}
      />
      <TextField
        label="City"
        name="city"
        variant="outlined"
        value={formik.values.city}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.city && formik.errors.city)}
        helperText={formik.touched.city ? formik.errors.city : undefined}
      />
      <TextField
        label="Postcode"
        name="postcode"
        variant="outlined"
        value={formik.values.postcode}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.postcode && formik.errors.postcode)}
        helperText={
          formik.touched.postcode ? formik.errors.postcode : undefined
        }
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Save
      </LoadingButton>
    </Form>
  );
};
