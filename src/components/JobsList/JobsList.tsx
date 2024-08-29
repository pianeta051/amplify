import { List, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Job } from "../../services/jobs";

type JobsListProps = { jobs: Job[] };

export const JobsList: FC<JobsListProps> = ({ jobs }) => {
  const navigate = useNavigate();
  return (
    <List>
      {jobs.map((job) => (
        <ListItemButton
          onClick={() => navigate(`/jobs/${job.id}`)}
          key={job.id}
        >
          <ListItemText
            primary={job.name}
            secondary={`${job.date} ${job.startTime} - ${job.endTime}`}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
