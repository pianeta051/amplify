import { FC, useEffect, useRef, useState } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { useSearchAddresses } from "../../hooks/useAddress/useSearchAddresses";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { CustomerSecondaryAddress } from "../../services/customers";

type AddressesSearchBarProps = {
  onSelected: (address: CustomerSecondaryAddress) => void;
  excludedIds?: string[];
  error?: boolean;
  helperText?: string;
};

export const AddressesSearchBar: FC<AddressesSearchBarProps> = ({
  onSelected,
  excludedIds = [],
  error: inputError,
  helperText,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const anchorEl = useRef<HTMLInputElement>(null);
  const { addresses, error, loading } = useSearchAddresses(
    searchTerm,
    excludedIds
  );

  useEffect(() => {
    if (addresses?.length || error) {
      setSuggestionsOpen(true);
    } else {
      setSuggestionsOpen(false);
    }
  }, [addresses?.length, error]);

  const searchHandler = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    if (addresses?.length || error) {
      setSuggestionsOpen(true);
    }
  };

  const closeSuggestionsHandler = () => {
    setSuggestionsOpen(false);
  };

  const selectHandler = (address: CustomerSecondaryAddress) => {
    closeSuggestionsHandler();
    onSelected(address);
  };

  return (
    <>
      <SearchBar
        onSearch={searchHandler}
        ref={anchorEl}
        loading={loading}
        error={inputError}
        helperText={helperText}
      />
      <Popover
        onClose={closeSuggestionsHandler}
        open={suggestionsOpen}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Container fixed maxWidth="sm">
          <List>
            {error ? (
              <ErrorAlert code={error} />
            ) : (
              addresses?.map((address) => (
                <ListItem key={address.id}>
                  <ListItemButton onClick={() => selectHandler(address)}>
                    <ListItemText
                      primary={`${address.street}, ${address.number} - ${address.city} (${address.postcode})`}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Container>
      </Popover>
    </>
  );
};
