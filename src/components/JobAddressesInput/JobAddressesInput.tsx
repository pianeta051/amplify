import { FC, useEffect, useState } from "react";
import { JobFormAddress } from "../JobForm/JobForm";
import { AddressesSearchBar } from "../AddressesSearchBar/AddressesSearchBar";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchAddresses } from "../../hooks/useAddress/useSearchAddresses";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type JobAddressesInputProps = {
  label?: string;
  name?: string;
  value: JobFormAddress[];
  onChange?: (event: {
    target: { name?: string; value: JobFormAddress[] };
  }) => void;
  error?: boolean;
  helperText?: string;
};

export const JobAddressesInput: FC<JobAddressesInputProps> = ({
  label,
  name,
  onChange,
  value,
  error,
  helperText,
}) => {
  const [initialAddresses] = useState<JobFormAddress[]>(value ?? []);
  const [selectedAddresses, setSelectedAddresses] = useState<
    CustomerSecondaryAddress[]
  >([]);

  const {
    addresses,
    error: initialLoadError,
    loading,
  } = useSearchAddresses(
    "",
    [],
    initialAddresses.map((a) => `${a.customerId}_${a.addressId}`)
  );

  useEffect(() => {
    if (!loading && !initialLoadError && addresses?.length) {
      setSelectedAddresses((selectedAddresses) =>
        [...selectedAddresses, ...addresses]
          // Remove duplicates
          .filter(
            (address, _index, array) =>
              array.indexOf(address) === array.lastIndexOf(address)
          )
      );
    }
  }, [addresses, loading, initialLoadError]);

  if (initialLoadError) {
    return <ErrorAlert code={initialLoadError} />;
  }

  if (loading) {
    return <CircularProgress />;
  }

  const addAddressHandler = (address: CustomerSecondaryAddress) => {
    setSelectedAddresses((addresses) => [...addresses, address]);
    onChange?.({
      target: {
        value: [
          ...value,
          { addressId: address.id, customerId: address.customerId as string },
        ],
        name,
      },
    });
  };

  const deleteAddressHandler = (address: CustomerSecondaryAddress) => {
    setSelectedAddresses((addresses) =>
      addresses.filter(
        (a) => a.id !== address.id || a.customerId !== address.customerId
      )
    );
    onChange?.({
      target: {
        value: value.filter(
          (a) =>
            a.addressId !== address.id || a.customerId !== address.customerId
        ),
        name,
      },
    });
  };

  return (
    <Card sx={{ marginTop: "20px" }}>
      <CardHeader title={label} />
      <CardContent>
        <AddressesSearchBar
          onSelected={addAddressHandler}
          excludedIds={selectedAddresses.map(
            (address) => `${address.customerId}_${address.id}`
          )}
          error={error}
          helperText={helperText}
        />
        <List>
          {selectedAddresses.length ? (
            selectedAddresses.map((address) => (
              <ListItem
                key={address.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteAddressHandler(address)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${address.street}, ${address.number} - ${address.city} (${address.postcode})`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No addresses selected</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};
