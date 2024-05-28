import {
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Form } from "../Form/Form";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    { onSearch, initialValue = "", loading = false, error, helperText },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const changeHandler: React.ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (event) => setSearchTerm(event.target.value);

    const submitHandler = () => {
      onSearch(searchTerm);
    };

    return (
      <Form onSubmit={submitHandler}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type="text"
            ref={ref}
            error={error}
            endAdornment={
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress />
                ) : (
                  <IconButton
                    aria-label="search"
                    type="submit"
                    edge="end"
                    disabled={loading}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </InputAdornment>
            }
            value={searchTerm}
            onChange={changeHandler}
          />
          {helperText && (
            <FormHelperText error={error}>{helperText}</FormHelperText>
          )}
        </FormControl>
      </Form>
    );
  }
);

SearchBar.displayName = "SearchBar";
