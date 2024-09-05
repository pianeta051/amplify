import { FC, useState } from "react";
import { useJobs } from "../../hooks/useJobs/useJobs";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { JobsList } from "../JobsList/JobsList";
import dayjs from "dayjs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export const DailyJobs: FC = () => {
  const today = dayjs().format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(today);
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs(
    { from: `${currentDate} 00:00`, to: `${currentDate} 23:59` },
    "desc"
  );
  const navigate = useNavigate();
  const createJobHandler = () => {
    navigate(`/jobs/create?date=${currentDate}`);
  };
  const nextDateHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    setCurrentDate(dayjs(currentDate).add(1, "day").format("YYYY-MM-DD"));
  };

  const previousDateHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setCurrentDate(dayjs(currentDate).subtract(1, "day").format("YYYY-MM-DD"));
  };

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
  const title = dayjs(currentDate).format("dddd, MMM D, YYYY");

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: "20px" }}>
        <Button
          variant="outlined"
          onClick={previousDateHandler}
          startIcon={<ArrowBackIosIcon />}
        >
          Previous
        </Button>
        <Typography variant="h4">{title}</Typography>
        <Button
          variant="outlined"
          onClick={nextDateHandler}
          endIcon={<ArrowForwardIosIcon />}
        >
          Next
        </Button>
      </Stack>
      <Button
        onClick={createJobHandler}
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ mb: "20px" }}
      >
        Add new
      </Button>

      <JobsList jobs={jobs} />

      {moreToLoad && (
        <LoadingButton loading={loadingMore} onClick={loadMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
