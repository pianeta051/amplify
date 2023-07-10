import {
  Button,
  CircularProgress,
  ListItemButton,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer, getCustomers } from "../../services/customers";
import { useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      getCustomers()
        .then((customers) => {
          setLoading(false);
          setCustomers(customers);
        })
        .catch((error) => {
          setLoading(false);
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  }, [loading, setLoading]);

  const onCreate = () => {
    navigate("/customers/create");
  };

  const customerClickHandler = (customer: Customer) => {
    navigate("/customers/" + customer.id);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Error code={error} />
      ) : (
        <>
          <Button onClick={onCreate}>Create new customer</Button>
          <CustomersList>
            {customers.map((customer) => (
              <ListItemButton
                key={customer.id}
                onClick={() => customerClickHandler(customer)}
              >
                <CustomerItem customer={customer} />
              </ListItemButton>
            ))}
          </CustomersList>
        </>
      )}
    </>
  );
};
