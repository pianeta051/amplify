import { Autocomplete, TextField } from "@mui/material";
import { FC, useMemo } from "react";
import { User } from "../../services/authentication";
import { useUsers } from "../../hooks/useUsers/useUsers";

type UserSelectorProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

type AutoCompleteOption = {
  label: string;
  value: string;
};

const userToOption = (user: User): AutoCompleteOption => {
  return {
    label: user.email,
    value: user.id,
  };
};

export const UserSelector: FC<UserSelectorProps> = ({ value, onChange }) => {
  const { users, loading } = useUsers();

  const selectedOption: AutoCompleteOption | null = useMemo(() => {
    const selectedUser = users?.find((user) => user.id === value);
    return selectedUser ? userToOption(selectedUser) : null;
  }, [users, value]);

  const autocompleteOptions = useMemo(
    () => users?.map(userToOption) ?? [],
    [users]
  );

  const changeHandler = (
    _event: React.SyntheticEvent,
    option: AutoCompleteOption | null
  ) => {
    onChange?.(option?.value ?? null);
  };

  return (
    <Autocomplete
      options={autocompleteOptions}
      renderInput={(params) => <TextField {...params} label="Assigned to" />}
      value={selectedOption}
      onChange={changeHandler}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{ marginY: "10px" }}
      disabled={loading}
    />
  );
};
