import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJob } from "../../hooks/useJobs/useJob";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { JobAddresses } from "../../components/JobAddresses/JobAddresses";
import { ErrorCode } from "../../services/error";
import { DeleteJobButton } from "../../components/DeleteJobButton/DeleteJobButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { JobImage } from "./JobDetails.style";

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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Date" secondary={job.date} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Start time" secondary={job.startTime} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="End time" secondary={job.endTime} />
            </ListItem>
            {job.assignedTo && (
              <ListItem disablePadding>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Assigned to"
                  secondary={[job.assignedTo.name, job.assignedTo.email]
                    .filter(Boolean)
                    .join(" - ")}
                />
              </ListItem>
            )}
          </List>
        </Grid>
        {job.imageUrl && (
          <Grid item xs={12} md={6}>
            <Card sx={{ maxWidth: "100%" }}>
              <JobImage src={job.imageUrl} />
            </Card>
          </Grid>
        )}
      </Grid>

      <JobAddresses jobId={jobId} />
    </>
  );
};
