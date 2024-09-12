import { Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { useCreateJob } from "../../hooks/useJobs/useCreateJob";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type CreateJobModalProps = {
  onClose: () => void;
  initialValues?: JobFormValues;
};

export const CreateJobModal: FC<CreateJobModalProps> = ({
  onClose,
  initialValues,
}) => {
  const { createJob, loading, error } = useCreateJob();
  const submitHandler = (values: JobFormValues) => {
    createJob(values).then(onClose);
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Create job</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {error && <ErrorAlert code={error} />}
        <JobForm
          onSubmit={submitHandler}
          initialValues={initialValues}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
