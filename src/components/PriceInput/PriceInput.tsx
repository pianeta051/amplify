import { FormHelperText, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type PriceInputProps = Omit<
  NumericFormatProps,
  "allowNegative" | "prefix" | "decimalScale" | "onChange"
> & {
  errorMessage?: string;
  onChange?: (event: { target: { name: string; value: number } }) => void;
};

export const PriceInput: FC<PriceInputProps> = ({
  errorMessage,
  onChange,
  name,
  ...props
}) => {
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = +event.target.value.replace("£", "");
    if (onChange) {
      onChange({
        target: {
          name: name ?? "price",
          value: numericValue,
        },
      });
    }
  };
  return (
    <>
      <NumericFormat
        customInput={
          errorMessage
            ? (ErrorPriceTextField as React.ComponentType)
            : (PriceTextField as React.ComponentType)
        }
        allowNegative={false}
        prefix="£ "
        decimalScale={2}
        onChange={changeHandler}
        {...props}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  );
};

type PriceTextFieldProps = Omit<TextFieldProps, "label">;

const PriceTextField: FC<PriceTextFieldProps> = (props) => (
  <TextField {...props} label="Price" />
);

type ErrorPriceTextFieldProps = Omit<PriceTextFieldProps, "error">;

const ErrorPriceTextField: FC<ErrorPriceTextFieldProps> = (props) => (
  <TextField {...props} label="Price" error />
);
