import { Typography, CircularProgress } from "@mui/material";
import { FC } from "react";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { useMainAddress } from "../../hooks/useMainAddress/useMainAddress";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type CustomerMainAddressProps = {
  customerId: string;
};

export const CustomerMainAddress: FC<CustomerMainAddressProps> = ({
  customerId,
}) => {
  const { mainAddress, error, loading } = useMainAddress(customerId);
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Main address
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error || !mainAddress) {
    return <ErrorAlert code={error ?? "INTERNAL_ERROR"} />;
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Main address
      </Typography>
      <CustomerAddress address={mainAddress} />
    </>
  );
};
