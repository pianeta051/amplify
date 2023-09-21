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
import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../components/SearchBar/SearchBar";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      getCustomers()
        .then(({ customers, nextToken }) => {
          setLoading(false);
          setCustomers(customers);
          setNextToken(nextToken);
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

  const loadMoreHandler = () => {
    if (nextToken) {
      setLoadingMore(true);
      getCustomers(nextToken, searchTerm)
        .then(({ customers, nextToken }) => {
          setLoadingMore(false);
          setCustomers((prevCustomers) => [...prevCustomers, ...customers]);
          setNextToken(nextToken);
        })
        .catch(() => {
          setLoadingMore(false);
          setNextToken(undefined);
        });
    }
  };

  const searchHandler = (searchTerm: string) => {
    setSearching(true);
    setSearchTerm(searchTerm);
    getCustomers(undefined, searchTerm)
      .then(({ customers, nextToken }) => {
        setSearching(false);
        setCustomers(customers);
        setNextToken(nextToken);
      })
      .catch(() => {
        setSearching(false);
        setCustomers([]);
        setNextToken(undefined);
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {loading || searching ? (
        <CircularProgress />
      ) : error ? (
        <Error code={error} />
      ) : (
        <>
          <SearchBar onSearch={searchHandler} initialValue={searchTerm} />
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
          {nextToken && (
            <LoadingButton
              variant="text"
              onClick={loadMoreHandler}
              loading={loadingMore}
            >
              Load more
            </LoadingButton>
          )}
        </>
      )}
    </>
  );
};
