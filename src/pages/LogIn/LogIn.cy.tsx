import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LogInPage } from "./LogIn";
import { Auth } from "aws-amplify";

const setup = (error: { code: string; message?: string }) => {
  cy.stub(Auth, "signIn").rejects(error);
  cy.mount(
    <MemoryRouter initialEntries={["/log-in"]}>
      <Routes>
        <Route path="log-in" element={<LogInPage />} />
      </Routes>
    </MemoryRouter>
  );
  cy.findByLabelText("Email").type("some-email@email.com");
  cy.findByLabelText("Password").type("some-password");
  cy.findByRole("button", { name: "Log in" }).click();
};

describe("Log in", () => {
  it("shows an error when the user does not exist", () => {
    setup({ code: "UserNotFoundException" });
    cy.contains("This email is not registered");
  });

  it("shows an incorrect password error when the password is incorrect", () => {
    setup({
      code: "NotAuthorizedException",
      message: "Anything",
    });
    cy.contains("Your password is incorrect");
  });

  it("when the retry limit has been exceeded", () => {
    setup({
      code: "NotAuthorizedException",
      message: "Password attempts exceeded",
    });
    cy.contains("You have exceeded the attempts limit. Try again in two hours");
  });

  it("when the server is down", () => {
    setup({ code: "Anything" });
    cy.contains("Internal error");
  });
});
