import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type EmailInputProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  errorMessage?: string;
  withAdornment?: boolean;
  name?: string;
};

export const EmailInput: FC<EmailInputProps> = ({
  value,
  onChange,
  errorMessage,
  withAdornment = true,
  name = "email",
}) => {
  return (
    <TextField
      label="Email"
      name={name}
      variant="outlined"
      value={value}
      margin="normal"
      onChange={onChange}
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        startAdornment: withAdornment ? (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
};
