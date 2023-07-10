import { List } from "@mui/material";
import { styled } from "@mui/system";

export const CustomersList = styled(List)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
}));
