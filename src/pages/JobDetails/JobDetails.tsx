import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJob } from "../../hooks/useJobs/useJob";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { JobAddresses } from "../../components/JobAddresses/JobAddresses";
import { ErrorCode } from "../../services/error";
import { DeleteJobButton } from "../../components/DeleteJobButton/DeleteJobButton";

type JobDetailsParams = {
  jobId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJob(jobId);
  const [operationError, setOperationError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const errorHandler = (code: ErrorCode) => {
    setOperationError(code);
  };

  const deleteHandler = () => {
    navigate("/jobs");
  };

  if (!jobId) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Job
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return <ErrorAlert code={error} />;
  }

  if (!job) {
    return <ErrorAlert code="JOB_NOT_EXISTS" />;
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {job.name}
      </Typography>
      {operationError && <ErrorAlert code={operationError} />}
      <Stack direction="row" spacing={2}>
        <Link to={`/jobs/${jobId}/edit`}>
          <Button variant="contained">Edit</Button>
        </Link>
        <DeleteJobButton
          jobId={jobId}
          onError={errorHandler}
          onDelete={deleteHandler}
        />
      </Stack>
      <JobAddresses jobId={jobId} />
    </>
  );
};
