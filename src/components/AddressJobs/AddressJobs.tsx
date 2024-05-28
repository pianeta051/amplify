import {
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { useJobs } from "../../hooks/useJobs/useJobs";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

type AddressJobsProps = {
  addressId: string;
  customerId: string;
};

export const AddressJobs: FC<AddressJobsProps> = ({
  addressId,
  customerId,
}) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs({
    addressId,
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
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <Link to={`/jobs/create?addressId=${addressId}&customerId=${customerId}`}>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Add new
        </Button>
      </Link>
      <List>
        {jobs.map((job) => (
          <ListItemButton key={job.id}>
            <ListItemText primary={job.name} />
          </ListItemButton>
        ))}
      </List>
      {moreToLoad && (
        <LoadingButton loading={loadingMore} onClick={loadMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
