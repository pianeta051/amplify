import { FC } from "react";
import { Job } from "../../services/jobs";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { UserColor } from "../UserColor/UserColor";

type JobCalendarColorLegendProps = {
  jobs: Job[];
};

export const JobCalendarColorLegend: FC<JobCalendarColorLegendProps> = ({
  jobs,
}) => {
  const usersWithColors = jobs
    .filter((job) => !!job.assignedTo?.color)
    .map((job) => job.assignedTo)
    // remove duplicate users
    .filter(
      (user, index, self) =>
        index === self.findIndex((t) => t?.sub === user?.sub)
    );
  if (usersWithColors.length === 0) {
    return null;
  }

  console.log(usersWithColors);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Color legend
        </Typography>
        <List>
          {usersWithColors.map((user) => (
            <ListItem disablePadding key={user?.sub}>
              <ListItemIcon>
                <UserColor color={user?.color as string} />
              </ListItemIcon>
              <ListItemText primary={user?.name ?? user?.email} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
