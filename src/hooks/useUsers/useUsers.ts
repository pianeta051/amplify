import useSWRImmutable from "swr/immutable";
import { getUsers, User } from "../../services/authentication";
import { extractErrorCode } from "../../services/error";

export const useUsers = () => {
  const {
    data: users,
    error,
    isLoading: loading,
  } = useSWRImmutable<User[], Error, readonly [string] | null>(
    ["users"],
    async ([_operation]) => getUsers()
  );

  return {
    users,
    error: extractErrorCode(error),
    loading,
  };
};
