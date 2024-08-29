import { FC } from "react";
import { useJobs } from "../../hooks/useJobs/useJobs";
import { CircularProgress, Typography } from "@mui/material";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { JobsList } from "../JobsList/JobsList";

type UpcomingAddressJobsProps = { addressId: string; customerId: string };

export const UpcomingAddressJobs: FC<UpcomingAddressJobsProps> = ({
  addressId,
  customerId,
}) => {
  const from = dayjs().format("YYYY-MM-DD HH:mm");
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs({
    addressId,
    customerId,
    from,
  });
  if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  if (error || !jobs) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Jobs
        </Typography>
        <ErrorAlert code={error ?? "INTERNAL_ERROR"} />
      </>
    );
  }

  return (
    <>
      <JobsList jobs={jobs} />
      {moreToLoad && (
        <LoadingButton loading={loadingMore} onClick={loadMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
