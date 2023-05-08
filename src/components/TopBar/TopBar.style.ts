import { Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/system";

export const Bar = styled(Toolbar)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const Logo = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "none",
  fontFamily: "monospace",
  fontWeight: 700,
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  letterSpacing: ".3rem",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));
