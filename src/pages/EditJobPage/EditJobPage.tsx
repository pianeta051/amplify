import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import {
  JobForm,
  JobFormAddress,
  JobFormValues,
} from "../../components/JobForm/JobForm";
import { useJob } from "../../hooks/useJobs/useJob";
import { useEditJob } from "../../hooks/useJobs/useEditJob";
import { useJobAddresses } from "../../hooks/useAddress/useJobAddresses";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import dayjs from "dayjs";

type EditJobParams = {
  jobId: string;
};

export const EditJobPage: FC = () => {
  const { jobId } = useParams<EditJobParams>();
  const { job, loading: loadingJob, error: errorLoadingJob } = useJob(jobId);
  const {
    addresses,
    error: errorLoadingAddresses,
    loading: loadingAddresses,
  } = useJobAddresses(jobId);
  const {
    editJob,
    loading: editingJob,
    error: errorEditingJob,
  } = useEditJob(jobId as string);
  const navigate = useNavigate();

  if (!jobId) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  if (loadingJob || loadingAddresses) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Edit job
        </Typography>
        <CircularProgress />
      </>
    );
  }

  const error = errorLoadingJob ?? errorLoadingAddresses;
  if (error) {
    return <ErrorAlert code={error} />;
  }

  if (!job) {
    return <ErrorAlert code="JOB_NOT_EXISTS" />;
  }

  if (!addresses?.length) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  const initialAddresses: JobFormAddress[] = addresses.map(
    (address) =>
      ({
        addressId: address.id,
        customerId: address.customerId,
      } as JobFormAddress)
  );

  const submitHandler = (
    formValues: JobFormValues,
    image: File | null,
    deleteImage: boolean
  ) => {
    editJob({ formValues, image, deleteImage })
      .then(() => {
        navigate(`/jobs/${jobId}`);
      })
      .catch((error) => {
        return error;
        // The hook should handle the error and set the error state
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit job
      </Typography>
      {errorEditingJob && <ErrorAlert code={errorEditingJob} />}
      <JobForm
        onSubmit={submitHandler}
        loading={editingJob}
        initialValues={{
          ...job,
          addresses: initialAddresses,
          date: dayjs(job.date),
          startTime: dayjs(`${job.date} ${job.startTime}`),
          endTime: dayjs(`${job.date} ${job.endTime}`),
          assignedTo: job.assignedTo?.sub,
          imageUrl: job.imageUrl,
        }}
      />
    </>
  );
};
