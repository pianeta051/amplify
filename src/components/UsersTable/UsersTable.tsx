import { FC } from "react";
import { User } from "../../services/authentication";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Wrapper } from "./UsersTable.style";
import { UserColor } from "../UserColor/UserColor";

type UsersTableProps = {
  users?: User[];
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 150,
  },
  {
    field: "color",
    headerName: "Color",
    renderCell: (params) =>
      params.value ? <UserColor color={params.value as string} /> : null,
  },
];

export const UsersTable: FC<UsersTableProps> = ({ users = [] }) => {
  return (
    <Wrapper elements={users.length}>
      <DataGrid columns={columns} rows={users} />
    </Wrapper>
  );
};
