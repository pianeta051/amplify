import { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { ErrorCode } from "../../services/error";
import { useDeleteJob } from "../../hooks/useJobs/useDeleteJob";

type DeleteJobButtonProps = {
  jobId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteJobButton: FC<DeleteJobButtonProps> = ({
  jobId,
  onDelete,
  onError,
}) => {
  const { deleteJob, loading } = useDeleteJob(jobId);
  const deleteHandler = () => {
    deleteJob()
      .then(() => {
        onDelete();
      })
      .catch((error) => {
        onError(error);
      });
  };
  return (
    <LoadingButton
      variant="contained"
      color="error"
      onClick={deleteHandler}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};
