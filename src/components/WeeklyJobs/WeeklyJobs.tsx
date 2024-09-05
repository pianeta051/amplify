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
import isoWeek from "dayjs/plugin/isoWeek";

export const WeeklyJobs: FC = () => {
  // Inicio de la semana
  dayjs.extend(isoWeek);
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const [startOfWeek, setStartOfWeek] = useState(lastMonday);
  const endOfWeek = dayjs(startOfWeek).add(1, "week").format("YYYY-MM-DD");

  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs(
    { from: `${startOfWeek} 00:00`, to: `${endOfWeek} 23:59` },
    "desc"
  );
  const navigate = useNavigate();
  const createJobHandler = () => {
    navigate(`/jobs/create?date=${startOfWeek}`);
  };
  const nextWeekHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    setStartOfWeek(dayjs(startOfWeek).add(1, "week").format("YYYY-MM-DD"));
  };

  const previousWeekHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setStartOfWeek(dayjs(startOfWeek).subtract(1, "week").format("YYYY-MM-DD"));
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

  const title = `${dayjs(startOfWeek).format("MMM D")} - ${dayjs(
    endOfWeek
  ).format("MMM D")}`;

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: "20px" }}>
        <Button
          variant="outlined"
          onClick={previousWeekHandler}
          startIcon={<ArrowBackIosIcon />}
        >
          Previous
        </Button>
        <Typography variant="h4">{title}</Typography>
        <Button
          variant="outlined"
          onClick={nextWeekHandler}
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
