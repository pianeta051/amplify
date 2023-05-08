import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserDetails } from "./UserDetails";

describe("UserDetails", () => {
  it("renders the ID when it's defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("1");
  });

  it("renders an error when the ID is not defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/users/:something" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Internal error");
  });
});
