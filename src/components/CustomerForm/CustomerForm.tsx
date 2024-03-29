import { FC } from "react";
import { CUSTOMER_TYPES, CustomerType } from "../../services/customers";
import { useFormik } from "formik";
import * as yup from "yup";
import { EmailInput } from "../EmailInput/EmailInput";
import { MenuItem, Select, TextField } from "@mui/material";
import { Form } from "../Form/Form";
import { LoadingButton } from "@mui/lab";

export type CustomerFormValues = {
  email: string;
  name: string;
  type: CustomerType;
};

const INITIAL_VALUES: CustomerFormValues = {
  email: "",
  name: "",
  type: "company",
};

const validationSchema = yup.object<CustomerFormValues>({
  email: yup.string().email().required(),
  name: yup.string().required(),
  type: yup.mixed<CustomerType>().oneOf(CUSTOMER_TYPES).required(),
});

const capitalize = (value: string) => {
  if (value.length <= 1) {
    return value.toUpperCase();
  }
  return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
};

type CustomerFormProps = {
  onSubmit: (values: CustomerFormValues) => void;
  defaultValues?: CustomerFormValues;
  loading?: boolean;
};

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading = false,
}) => {
  const formik = useFormik<CustomerFormValues>({
    initialValues: defaultValues,
    onSubmit,
    validationSchema,
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput
        name="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        errorMessage={formik.touched.email ? formik.errors.email : undefined}
        withAdornment={false}
      />
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
      <Select
        value={formik.values.type}
        label="Type"
        name="type"
        onChange={formik.handleChange}
      >
        {CUSTOMER_TYPES.map((type) => (
          <MenuItem value={type} key={type}>
            {capitalize(type)}
          </MenuItem>
        ))}
      </Select>
      <LoadingButton variant="contained" type="submit" loading={loading}>
        Save
      </LoadingButton>
    </Form>
  );
};
