import { FC } from "react";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../CustomerAddressForm/CustomerAddressForm";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { useAddSecondaryAddress } from "../../hooks/useSecondaryAddress/useAddSecondaryAddress";
import { CustomerSecondaryAddress } from "../../services/customers";
import { useEditCustomerSecondaryAddress } from "../../hooks/useSecondaryAddress/useEditCustomerSecondaryAddress";

type CustomerSecondaryAddressModalProps = {
  customerId: string;
  onClose: () => void;
  open: boolean;
  address?: CustomerSecondaryAddress;
};

export const CustomerSecondaryAddressModal: FC<
  CustomerSecondaryAddressModalProps
> = ({ customerId, onClose, open, address }) => {
  const {
    addSecondaryAddress,
    loading: creating,
    error: errorCreating,
  } = useAddSecondaryAddress(customerId);
  const {
    editCustomerSecondaryAddress,
    loading: editing,
    error: errorEditing,
  } = useEditCustomerSecondaryAddress(customerId, address?.id);

  const submitHandler = (addressFormValues: CustomerAddressFormValues) => {
    if (address) {
      editCustomerSecondaryAddress(addressFormValues)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    } else {
      addSecondaryAddress(addressFormValues)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    }
  };

  const loading = creating || editing;
  const error = errorCreating ?? errorEditing ?? null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {address === undefined
          ? "Add secondary address"
          : "Edit secondary address"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {error && <ErrorAlert code={error} />}
        <CustomerAddressForm
          onSubmit={submitHandler}
          loading={loading}
          defaultValues={address}
        />
        <Button size="small" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
