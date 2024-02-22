import { FC, ReactNode } from "react";
import { StyledForm } from "./Form.style";

type FormProps = {
  children?: ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  direction?: "row" | "column";
};

export const Form: FC<FormProps> = ({ children, onSubmit, direction }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <StyledForm onSubmit={submitHandler} direction={direction}>
      {children}
    </StyledForm>
  );
};
