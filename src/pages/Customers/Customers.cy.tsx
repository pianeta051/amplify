import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CustomersPage } from "./Customers";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme/theme";
import { API } from "aws-amplify";
import { customerFactory } from "../../factories/customers";

const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={["/customers"]}>
        <Routes>
          <Route path="customers" element={<CustomersPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe("CustomersPage", () => {
  it("displays the name of the customers", () => {
    const customers = customerFactory.buildList(2);
    cy.stub(API, "get").resolves({
      customers,
    });
    mountComponent();
    for (const customer of customers) {
      cy.contains(customer.name);
    }
  });

  it("displays the message No Customers when the customers array is empty", () => {
    cy.stub(API, "get").resolves({
      customers: [],
    });
    mountComponent();
    cy.contains("No Customers");
  });

  it("displays an error message if some of the customers is not valid", () => {
    const invalidCustomer = {
      id: "1",
      surname: "John",
    };
    cy.stub(API, "get").resolves({
      customers: [invalidCustomer],
    });
    mountComponent();
    cy.contains("Internal error");
  });

  it("displays an error message if the API call fails", () => {
    cy.stub(API, "get").rejects();
    mountComponent();
    cy.contains("Internal error");
  });

  it("displays the Load More button when there is a nextToken in the response", () => {
    const customers = customerFactory.buildList(5);
    cy.stub(API, "get").resolves({
      customers,
      nextToken: "me lo invento",
    });
    mountComponent();
    cy.contains("Load more");
  });

  it("loads a second page of Customer when clicking the Load More button", () => {
    const customersFirstPage = customerFactory.buildList(5);
    const customersSecondPage = customerFactory.buildList(3);
    cy.stub(API, "get")
      .onFirstCall()
      .resolves({
        customers: customersFirstPage,
        nextToken: "me lo invento",
      })
      .onSecondCall()
      .resolves({
        customers: customersSecondPage,
      });
    mountComponent();
    // Initially it should display the first page of customers
    // but not the second
    for (const customer of customersFirstPage) {
      cy.contains(customer.name);
    }
    for (const customer of customersSecondPage) {
      cy.contains(customer.name).should("not.exist");
    }
    // Click the Load More button
    cy.contains("Load more").click();
    // Now it should display both pages
    for (const customer of customersFirstPage) {
      cy.contains(customer.name);
    }
    for (const customer of customersSecondPage) {
      cy.contains(customer.name);
    }
  });
});
