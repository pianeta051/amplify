import { FC } from "react";
import {
  JobForm,
  JobFormAddress,
  JobFormValues,
} from "../../components/JobForm/JobForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useCreateJob } from "../../hooks/useJobs/useCreateJob";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

export const CreateJobPage: FC = () => {
  const { createJob, loading, error } = useCreateJob();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("addressId");
  const customerId = searchParams.get("customerId");
  const date = searchParams.get("date");
  const { user } = useAuth();

  const submitHandler = (formValues: JobFormValues) => {
    createJob(formValues)
      .then((job) => {
        navigate(`/jobs/${job.id}`);
      })
      .catch(() => {
        // The hook should handle the error and set the error state
      });
  };

  const initialAddresses: JobFormAddress[] = [];
  if (addressId && customerId) {
    initialAddresses.push({ addressId, customerId });
  }

  const defaultDate = date ? dayjs(date) : dayjs();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Create new job
      </Typography>
      {error && <ErrorAlert code={error} />}
      <JobForm
        onSubmit={submitHandler}
        loading={loading}
        initialValues={{
          name: "",
          addresses: initialAddresses,
          date: defaultDate,
          startTime: dayjs(),
          endTime: dayjs().add(1, "hour"),
          assignedTo: user?.attributes?.sub,
          imageUrl: "",
        }}
      />
    </>
  );
};
