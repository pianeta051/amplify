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
import { useAddSecondaryAddress } from "../../hooks/useSecondaryAddress/useAddSecondaryAddress";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { useEditCustomerSecondaryAddress } from "../../hooks/useSecondaryAddress/useEditCustomerSecondaryAddress";
import { useAddMainAddress } from "../../hooks/useMainAddress/useAddMainAddress";
import { useEditMainAddress } from "../../hooks/useMainAddress/useEditMainAddress";

type CustomerAddressModalProps = {
  customerId: string;
  onClose: () => void;
  open: boolean;
  initialValues?: CustomerAddressFormValues;
  addressId?: string;
  addressType: "main" | "secondary";
};

export const CustomerAddressModal: FC<CustomerAddressModalProps> = ({
  customerId,
  onClose,
  open,
  initialValues,
  addressId,
  addressType,
}) => {
  const {
    addSecondaryAddress,
    loading: creatingSecondary,
    error: secondaryCreationError,
  } = useAddSecondaryAddress(customerId);
  const {
    editCustomerSecondaryAddress,
    loading: editingSecondary,
    error: secondaryEditionError,
  } = useEditCustomerSecondaryAddress(customerId, addressId);
  const {
    addMainAddress,
    loading: creatingMain,
    error: mainCreationError,
  } = useAddMainAddress(customerId);
  const {
    editMainAddress,
    loading: editingMain,
    error: mainEditionError,
  } = useEditMainAddress(customerId);

  const submitHandler = (address: CustomerAddressFormValues) => {
    // If the address ID is specified, this is an edit
    if (addressId) {
      if (addressType === "main") {
        editMainAddress(address)
          .then(onClose)
          .catch(() => {
            // Do nothing, error is handled by the hook
          });
      } else {
        editCustomerSecondaryAddress(address)
          .then(onClose)
          .catch(() => {
            // Do nothing, error is handled by the hook
          });
      }
    }
    // If not, this is a new address
    else if (addressType === "main") {
      addMainAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    } else {
      addSecondaryAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    }
  };

  const error =
    secondaryCreationError ??
    secondaryEditionError ??
    mainCreationError ??
    mainEditionError;
  const loading =
    editingSecondary || creatingSecondary || creatingMain || editingMain;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {addressId ? "Edit address" : "Add address"}
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
          defaultValues={initialValues}
        />
        <Button size="small" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
