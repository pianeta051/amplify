import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { Button, InputAdornment, TextField } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { LoadingButton } from "@mui/lab";

export type CustomerExternalLinkFormValues = {
  url: string;
};

const EMPTY_FORM: CustomerExternalLinkFormValues = {
  url: "",
};

const validationSchema = yup.object<CustomerExternalLinkFormValues>({
  url: yup.string().required("This field is required"),
});

type CustomerExternalLinkFormProps = {
  onSubmit: (formValues: CustomerExternalLinkFormValues) => void;
  loading?: boolean;
  initialValues?: CustomerExternalLinkFormValues;
  onCancel: () => void;
};

export const CustomerExternalLinkForm: FC<CustomerExternalLinkFormProps> = ({
  onSubmit,
  loading,
  initialValues = EMPTY_FORM,
  onCancel,
}) => {
  const formik = useFormik<CustomerExternalLinkFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit} direction="row">
      <TextField
        label="URL"
        name="url"
        variant="outlined"
        value={formik.values.url}
        margin="normal"
        onChange={formik.handleChange}
        error={!!(formik.touched.url && formik.errors.url)}
        helperText={formik.touched.url ? formik.errors.url : undefined}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        loading={loading}
        variant="text"
        type="submit"
        size="small"
      >
        Save
      </LoadingButton>
      <Button size="small" color="error" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
};
