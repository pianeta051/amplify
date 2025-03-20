import { Card } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/system";

export const ImageDisplay = styled(Card)<{ image?: string }>(({ image }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "300px",
  backgroundImage: image ? `url(${image})` : "none",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  "&:hover": {
    // Add black transparent overlay on hover
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    },
    "& > *": {
      display: "flex",
    },
  },
  "& > *": {
    zIndex: 2,
    display: "none",
  },
}));

export const DeleteButton = styled(ClearIcon)({
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "white",
  },
});
