import styledComponents from "styled-components";

type WrapperProps = {
  elements: number;
};

export const Wrapper = styledComponents.div<WrapperProps>(({ elements }) => ({
  height: `${elements > 0 ? 52 * elements + 111 : 150}px`,
}));
