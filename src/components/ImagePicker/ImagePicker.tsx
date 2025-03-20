import { FC } from "react";
import { UploadFileButton } from "../UploadFileButton/UploadFileButton";
import { DeleteButton, ImageDisplay } from "./ImagePicker.style";
import { CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export type ImagePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange }) => {
  if (value) {
    return (
      <ImageDisplay image={value}>
        <DeleteButton onClick={() => onChange("")}>
          <DeleteIcon />
        </DeleteButton>
        <UploadFileButton onChange={onChange} />
      </ImageDisplay>
    );
  }
  return <UploadFileButton onChange={onChange} />;
};
