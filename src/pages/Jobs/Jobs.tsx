import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { FC, useState } from "react";
import { DailyJobs } from "../../components/DailyJobs/DailyJobs";
import { WeeklyJobs } from "../../components/WeeklyJobs/WeeklyJobs";

export const JobsPage: FC = () => {
  const [view, setView] = useState<"daily" | "weekly">("daily");

  const changeViewHandler = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "daily" | "weekly"
  ) => {
    setView(newView);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={view}
        exclusive
        onChange={changeViewHandler}
      >
        <ToggleButton value="daily">Daily</ToggleButton>
        <ToggleButton value="weekly">Weekly</ToggleButton>
      </ToggleButtonGroup>
      {view === "daily" ? <DailyJobs /> : <WeeklyJobs />}
    </>
  );
};
