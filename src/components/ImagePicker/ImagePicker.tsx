import { FC } from "react";
import { UploadFileButton } from "../UploadFileButton/UploadFileButton";
import { DeleteButton, ImageDisplay } from "./ImagePicker.style";
import DeleteIcon from "@mui/icons-material/Delete";

export type ImagePickerProps = {
  value: string;
  onChange: (value: File | null) => void;
};

export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange }) => {
  if (value) {
    return (
      <ImageDisplay image={value}>
        <DeleteButton onClick={() => onChange(null)}>
          <DeleteIcon />
        </DeleteButton>
        <UploadFileButton onChange={onChange} label="Change image" />
      </ImageDisplay>
    );
  }
  return <UploadFileButton onChange={onChange} label="Add image" />;
};
