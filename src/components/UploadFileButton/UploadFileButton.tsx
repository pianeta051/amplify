import { Button } from "@mui/material";
import { FC } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "./UploadFileButton.style";

type UploadFileButtonProps = {
  onChange: (fileUrl: string) => void;
};

export const UploadFileButton: FC<UploadFileButtonProps> = ({ onChange }) => {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput type="file" onChange={changeHandler} />
    </Button>
  );
};
