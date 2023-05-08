import { API, Auth } from "aws-amplify";
import { UsersPage } from "./Users";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("Users", () => {
  it("renders an empty table when the response users are an empty array", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").resolves({ Users: [] });
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("No rows");
  });

  it("renders the user when the response has a valid user", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").resolves({
      Users: [
        {
          Username: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4",
          Attributes: [
            { Name: "sub", Value: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4" },
            { Name: "email_verified", Value: "true" },
            { Name: "email", Value: "sawila1096@iucake.com" },
          ],
          UserCreateDate: "2023-02-13T16:15:44.925Z",
          UserLastModifiedDate: "2023-02-13T17:08:10.575Z",
          Enabled: true,
          UserStatus: "CONFIRMED",
        },
      ],
    });
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("sawila1096@iucake.com");
  });

  it("it does not show the invalid user when a user does not have Username", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").resolves({
      Users: [
        {
          Username: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4",
          Attributes: [
            { Name: "sub", Value: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4" },
            { Name: "email_verified", Value: "true" },
            { Name: "email", Value: "sawila1096@iucake.com" },
          ],
          UserCreateDate: "2023-02-13T16:15:44.925Z",
          UserLastModifiedDate: "2023-02-13T17:08:10.575Z",
          Enabled: true,
          UserStatus: "CONFIRMED",
        },
        {
          Attributes: [
            { Name: "sub", Value: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4" },
            { Name: "email_verified", Value: "true" },
            { Name: "email", Value: "invalid@iucake.com" },
          ],
          UserCreateDate: "2023-02-13T16:15:44.925Z",
          UserLastModifiedDate: "2023-02-13T17:08:10.575Z",
          Enabled: true,
          UserStatus: "CONFIRMED",
        },
      ],
    });
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("invalid@iucake.com").should("not.exist");
  });

  it("when the user does not have email attribute", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").resolves({
      Users: [
        {
          Username: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4",
          Attributes: [
            { Name: "sub", Value: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4" },
            { Name: "email_verified", Value: "true" },
            { Name: "email", Value: "sawila1096@iucake.com" },
          ],
          UserCreateDate: "2023-02-13T16:15:44.925Z",
          UserLastModifiedDate: "2023-02-13T17:08:10.575Z",
          Enabled: true,
          UserStatus: "CONFIRMED",
        },
        {
          Username: "Pepe",
          Attributes: [
            { Name: "sub", Value: "3b4d5f34-cac1-4ee1-8fc0-81b8792f7bf4" },
          ],
          UserCreateDate: "2023-02-13T16:15:44.925Z",
          UserLastModifiedDate: "2023-02-13T17:08:10.575Z",
          Enabled: true,
          UserStatus: "CONFIRMED",
        },
      ],
    });
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
  });

  it("when the API returns an error", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").rejects();
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
