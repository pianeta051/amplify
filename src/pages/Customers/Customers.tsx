import {
  Button,
  CircularProgress,
  ListItemButton,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { FC, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer } from "../../services/customers";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useCustomers } from "../../hooks/useCustomers";

export const CustomersPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchButtonTerms, setSearchButtonTerms] = useState<string[]>([]);

  const navigate = useNavigate();
  const { customers, moreToLoad, loading, error, loadMore, loadingMore } =
    useCustomers(searchTerm, searchButtonTerms);

  const onCreate = () => {
    navigate("/customers/create");
  };

  const customerClickHandler = (customer: Customer) => {
    navigate("/customers/" + customer.id);
  };

  const searchHandler = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const searchButtonHandler = (buttonName: string) => {
    if (searchButtonTerms.includes(buttonName)) {
      const newTerms = searchButtonTerms.filter((term) => term !== buttonName);
      setSearchButtonTerms(newTerms);
    } else {
      const newTerms = [...searchButtonTerms, buttonName];
      setSearchButtonTerms(newTerms);
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
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <ErrorAlert code={error} />
        ) : (
          <>
            <CustomersList>
              {!customers?.length ? (
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
            {moreToLoad && (
              <LoadingButton
                variant="text"
                onClick={loadMore}
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
