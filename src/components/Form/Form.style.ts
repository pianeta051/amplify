import styledComponents from "styled-components";

type StyledFormProps = {
  direction?: "column" | "row";
};

export const StyledForm = styledComponents.form<StyledFormProps>(
  ({ direction = "column" }) => ({
    display: "flex",
    flexDirection: direction,
    gap: direction === "row" ? "10px" : undefined,
  })
);
