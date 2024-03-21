import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FC, useState } from "react";
import { DeleteCustomerExternalLinkButton } from "../DeleteCustomerExternalLinkButton/DeleteCustomerExternalLinkButton";
import {
  CustomerExternalLinkForm,
  CustomerExternalLinkFormValues,
} from "../CustomerExternalLinkForm/CustomerExternalLinkForm";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useEditCustomerExternalLink } from "../../hooks/useExternalLink/useEditCustomerExternalLink";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type CustomerExternalLinkProps = {
  url: string;
  customerId: string;
  index: number;
};

export const CustomerExternalLink: FC<CustomerExternalLinkProps> = ({
  url,
  customerId,
  index,
}) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const { editCustomerExternalLink, loading, error } =
    useEditCustomerExternalLink(customerId);

  const submitHandler = (values: CustomerExternalLinkFormValues) => {
    editCustomerExternalLink({ formValues: values, index })
      .then(() => {
        navigate(`/customers/${customerId}?tab=externalLinks`);
      })
      .catch((error): void => {
        console.log(error);
      });

    closeForm();
  };

  return showForm ? (
    <CustomerExternalLinkForm
      onSubmit={submitHandler}
      onCancel={closeForm}
      loading={loading}
      initialValues={{ url }}
    />
  ) : (
    <>
      {error && <ErrorAlert code={error} />}
      <ListItem
        secondaryAction={
          <>
            <DeleteCustomerExternalLinkButton
              customerId={customerId}
              index={index}
            />

            <IconButton edge="end" aria-label="update" onClick={openForm}>
              <EditIcon />
            </IconButton>
          </>
        }
      >
        <ListItemButton component="a" href={url} target="_blank">
          <ListItemText primary={url} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
