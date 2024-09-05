import { Typography } from "@mui/material";
import { FC } from "react";
import { DailyJobs } from "../../components/DailyJobs/DailyJobs";

export const JobsPage: FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <DailyJobs />
    </>
  );
};
