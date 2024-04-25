import { FC, useState } from "react";
import { CustomerSecondaryAddressesTable } from "../CustomerSecondaryAddressesTable/CustomerSecondaryAddressesTable";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useCustomerSecondaryAddresses } from "../../hooks/useSecondaryAddress/useCustomerSecondaryAddresses";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import AddIcon from "@mui/icons-material/Add";
import { CustomerSecondaryAddressModal } from "../CustomerSecondaryAddressModal/CustomerSecondaryAddressModal";
import { LoadingButton } from "@mui/lab";

type CustomerSecondaryAddressesProps = {
  customerId: string;
};

export const CustomerSecondaryAddresses: FC<
  CustomerSecondaryAddressesProps
> = ({ customerId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddressId, setEditingAddresId] = useState<string | null>(null);
  const {
    customerSecondaryAddresses,
    loading,
    error,
    moreToLoad,
    loadMore,
    loadingMore,
  } = useCustomerSecondaryAddresses(customerId);

  const openModal = (addressId?: string) => {
    setEditingAddresId(addressId ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAddresId(null);
  };

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Secondary addresses
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error || !customerSecondaryAddresses) {
    return <ErrorAlert code={error ?? "INTERNAL_ERROR"} />;
  }

  const editClickHandler = (addressId: string) => {
    openModal(addressId);
  };

  const editingAddress = customerSecondaryAddresses.find(
    (address) => address.id === editingAddressId
  );

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Secondary addresses
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => openModal()}
      >
        Add new
      </Button>
      <CustomerSecondaryAddressesTable
        addresses={customerSecondaryAddresses}
        customerId={customerId}
        onEditClick={editClickHandler}
      />
      <CustomerSecondaryAddressModal
        customerId={customerId}
        onClose={closeModal}
        open={modalOpen}
        address={editingAddress}
      />
      {moreToLoad && (
        <LoadingButton variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
