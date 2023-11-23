import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  capitalize,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { VOUCHER_TYPES, VoucherType } from "../../services/customers";

type VoucherFormProps = {
  onSubmit: (values: VoucherFormValues) => void;
  defaultValues?: VoucherFormValues;
  loading?: boolean;
};

export type VoucherFormValues = {
  voucherId: string;
  value: number;
  type: VoucherType;
};

const INITIAL_VALUES: VoucherFormValues = {
  voucherId: "",
  value: 1,
  type: "absolute",
};

const validationSchema = yup.object<VoucherFormValues>({
  voucherId: yup.string().required("Voucher ID field cannot be empty"),
  value: yup.number().positive(),
  type: yup.mixed<VoucherType>().oneOf(VOUCHER_TYPES).required(),
});

export const VoucherForm: FC<VoucherFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading = false,
}) => {
  const formik = useFormik<VoucherFormValues>({
    initialValues: defaultValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <TextField
        label="Voucher ID"
        name="voucherId"
        variant="outlined"
        value={formik.values.voucherId}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.voucherId && formik.errors.voucherId)}
        helperText={
          formik.touched.voucherId ? formik.errors.voucherId : undefined
        }
      />
      <TextField
        label="Voucher value"
        name="value"
        variant="outlined"
        value={formik.values.value}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.value && formik.errors.value)}
        helperText={formik.touched.value ? formik.errors.value : undefined}
        type="number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {formik.values.type === "absolute" ? "£" : "%"}
            </InputAdornment>
          ),
        }}
      />
      <Select
        value={formik.values.type}
        label="Type"
        name="type"
        onChange={formik.handleChange}
      >
        {VOUCHER_TYPES.map((type) => (
          <MenuItem value={type} key={type}>
            {capitalize(type)}
          </MenuItem>
        ))}
      </Select>
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Save
      </LoadingButton>
    </Form>
  );
};
// condicion ? valor si true : valor si false
