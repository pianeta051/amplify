import { UsersTable } from "./UsersTable";

describe("UsersTable", () => {
  it("renders an empty table when the users array is undefined", () => {
    cy.mount(<UsersTable />);
    cy.findByText("No rows");
  });

  it("renders an empty table when the users array is empty", () => {
    cy.mount(<UsersTable users={[]} />);
    cy.findByText("No rows");
  });

  it("renders a table with the user name and email when there's a user in the array", () => {
    cy.mount(
      <UsersTable
        users={[{ id: "112", name: "pepe", email: "pepe@email.com" }]}
      />
    );
    cy.findByText("pepe");
    cy.findByText("pepe@email.com");
  });
});
