import {
  Button,
  CircularProgress,
  ListItemButton,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { FC, useEffect, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer } from "../../services/customers";
import { useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../services/error";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useCustomers } from "../../context/CustomersContext";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchButtonTerms, setSearchButtonTerms] = useState<string[]>([]);

  const navigate = useNavigate();
  const { getCustomers } = useCustomers();

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
      getCustomers(nextToken, searchTerm, searchButtonTerms)
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
    getCustomers(undefined, searchTerm, searchButtonTerms)
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

  const searchButtonHandler = (buttonName: string) => {
    setSearching(true);
    // if el boton esta activo
    // ["company", "other"]
    if (searchButtonTerms.includes(buttonName)) {
      // desactivalo
      // ["other"]
      const newTerms = searchButtonTerms.filter((term) => term !== buttonName);
      setSearchButtonTerms(newTerms);
      // Refrescar la lista de customers con la nueva condicion
      getCustomers(undefined, searchTerm, newTerms)
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
    } else {
      // activalo
      // ["other"] -> ["company", "other"]
      const newTerms = [...searchButtonTerms, buttonName];
      setSearchButtonTerms(newTerms);
      getCustomers(undefined, searchTerm, newTerms)
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
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      <>
        <SearchBar onSearch={searchHandler} initialValue={searchTerm} />
        <Stack spacing={2} direction="row" mt={2}>
          <Button
            variant={
              searchButtonTerms.includes("company") ? "contained" : "outlined"
            }
            onClick={() => searchButtonHandler("company")}
          >
            Company
          </Button>
          <Button
            variant={
              searchButtonTerms.includes("individual")
                ? "contained"
                : "outlined"
            }
            onClick={() => searchButtonHandler("individual")}
          >
            Individual
          </Button>
          <Button
            variant={
              searchButtonTerms.includes("other") ? "contained" : "outlined"
            }
            onClick={() => searchButtonHandler("other")}
          >
            Other
          </Button>
        </Stack>
        <Button onClick={onCreate}>Create new customer</Button>
        {loading || searching ? (
          <CircularProgress />
        ) : error ? (
          <ErrorAlert code={error} />
        ) : (
          <>
            <CustomersList>
              {customers.length === 0 ? (
                <ErrorAlert code="NO_CUSTOMERS" />
              ) : (
                customers.map((customer) => (
                  <ListItemButton
                    key={customer.id}
                    onClick={() => customerClickHandler(customer)}
                  >
                    <CustomerItem customer={customer} />
                  </ListItemButton>
                ))
              )}
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
    </>
  );
};
