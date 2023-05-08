import { Form } from "./Form";

describe("Form", () => {
  it("calls onSubmit when clicking a submit button", () => {
    cy.mount(
      <Form onSubmit={cy.spy().as("submitHandler")}>
        <button type="submit">Send</button>
      </Form>
    );
    cy.findByRole("button").click();
    cy.get("@submitHandler").should("have.been.called");
  });

  it("calls onSubmit when pressing intro in a text input", () => {
    cy.mount(
      <Form onSubmit={cy.spy().as("submitHandler")}>
        <input type="text" id="dummy-input" />
        <label htmlFor="dummy-input">Name</label>
      </Form>
    );
    cy.findByLabelText("Name").type("Carlos{enter}");
    cy.get("@submitHandler").should("have.been.called");
  });
});
