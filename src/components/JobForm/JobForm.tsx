import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { Button, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JobAddressesInput } from "../JobAddressesInput/JobAddressesInput";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { UserSelector } from "../UserSelector/UserSelector";
import { useAuth } from "../../context/AuthContext";
import { UploadFileButton } from "../UploadFileButton/UploadFileButton";
import { ImagePicker } from "../ImagePicker/ImagePicker";

export type JobFormAddress = { addressId: string; customerId: string };

export type JobFormValues = {
  name: string;
  addresses: JobFormAddress[];
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  assignedTo?: string;
  imageUrl: string;
};

const INITIAL_VALUES: JobFormValues = {
  name: "",
  addresses: [],
  date: dayjs(),
  startTime: dayjs(),
  endTime: dayjs(),
  imageUrl: "",
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
  date: yup.date().required(),
  startTime: yup.date().required(),
  endTime: yup.date(),
  assignedTo: yup.string(),
  imageUrl: yup.string(),
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
  const { isInGroup } = useAuth();

  const changeUserHandler = (value: string | null) => {
    formik.handleChange({ target: { name: "assignedTo", value } });
  };

  const changeFileHandler = (value: string) => {
    formik.handleChange({ target: { name: "imageUrl", value } });
  };

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
        <DatePicker
          label="Date"
          name="date"
          value={formik.values.date}
          onChange={(value) =>
            formik.handleChange({ target: { value, name: "date" } })
          }
          sx={{ marginY: "10px" }}
        />
        <TimePicker
          label="Start Time"
          name="startTime"
          value={formik.values.startTime}
          onChange={(value) =>
            formik.handleChange({ target: { value, name: "startTime" } })
          }
          sx={{ marginY: "10px" }}
          views={["hours", "minutes"]}
          ampm={false}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
        />
        <TimePicker
          label="End Time"
          name="endTime"
          value={formik.values.endTime}
          onChange={(value) =>
            formik.handleChange({ target: { value, name: "endTime" } })
          }
          sx={{ marginY: "10px" }}
          views={["hours", "minutes"]}
          ampm={false}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
          minTime={formik.values.startTime}
        />
        {isInGroup("Admin") && (
          <UserSelector
            value={formik.values.assignedTo}
            onChange={changeUserHandler}
          />
        )}
        <ImagePicker
          onChange={changeFileHandler}
          value={formik.values.imageUrl}
        />
        <LoadingButton loading={loading} variant="outlined" type="submit">
          Submit
        </LoadingButton>
      </Form>
    </>
  );
};
