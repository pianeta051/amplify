import { Typography, CircularProgress } from "@mui/material";
import { FC } from "react";
import { useCustomerSecondaryAddress } from "../../hooks/useSecondaryAddress/useCustomerSecondaryAddress";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type CustomerSecondaryAddressProps = {
  customerId: string;
  addressId: string;
};

export const CustomerSecondaryAddress: FC<CustomerSecondaryAddressProps> = ({
  customerId,
  addressId,
}) => {
  const { secondaryAddress, loading, error } = useCustomerSecondaryAddress(
    customerId,
    addressId
  );
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Secondary address
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error || !secondaryAddress) {
    return <ErrorAlert code={error ?? "INTERNAL_ERROR"} />;
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Secondary address
      </Typography>
      <CustomerAddress address={secondaryAddress} />
    </>
  );
};
