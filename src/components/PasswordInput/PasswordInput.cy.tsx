import { PasswordInput } from "./PasswordInput";
describe("PasswordInput", () => {
  it("hides the password by default", () => {
    cy.mount(<PasswordInput value="clave" />);
    cy.get('input[type="password"]');
  });

  it("shows the password when clicking the toggle button once", () => {
    cy.mount(<PasswordInput value="clave" />);
    cy.findByLabelText("show password").click();
    cy.get('input[type="text"]');
  });

  it("hides the password when clicking the button twice", () => {
    cy.mount(<PasswordInput value="clave" />);
    cy.findByLabelText("show password").click();
    cy.findByLabelText("hide password").click();
    cy.get('input[type="password"]');
  });

  it("calls onChange when the user types", () => {
    cy.mount(<PasswordInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Password").type("clave");
    cy.get("@changeHandler").should("have.been.calledWith", "clave");
  });
});
