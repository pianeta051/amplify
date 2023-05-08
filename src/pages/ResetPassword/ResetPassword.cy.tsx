import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ResetPasswordPage } from "./ResetPassword";
import { Auth } from "aws-amplify";

describe("ResetPassword", () => {
  it("shows an error when email parameter is not set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/test?code=1234"]}>
        <Routes>
          <Route path="/test" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Invalid link");
  });

  it("shows an error when code parameter is not set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/test?email=pepe@a.c"]}>
        <Routes>
          <Route path="test" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Invalid link");
  });

  it("renders the form when both email and code parameters are set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/test?email=pepe@a.c&code=1234"]}>
        <Routes>
          <Route path="test" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Reset your password");
  });

  it("redirects to log in when the operation is successful", () => {
    cy.stub(Auth, "forgotPasswordSubmit").resolves();
    cy.mount(
      <MemoryRouter initialEntries={["/test?email=pepe@a.c&code=1234"]}>
        <Routes>
          <Route path="test" element={<ResetPasswordPage />} />
          <Route path="/log-in" element={<div>Success!</div>} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.contains("Success!");
  });

  it("shows an error when the users does not exist", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects({
      code: "UserNotFoundException",
    });
    cy.mount(
      <MemoryRouter initialEntries={["/test?email=pepe@a.c&code=1234"]}>
        <Routes>
          <Route path="test" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.contains("This email is not registered");
  });
});
