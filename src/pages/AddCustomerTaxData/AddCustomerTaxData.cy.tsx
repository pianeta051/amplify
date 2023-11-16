import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme/theme";
import { CustomersProvider } from "../../components/CustomersProvider/CustomersProvider";
import { API } from "aws-amplify";
import { customerFactory } from "../../factories/customers";
import { AddCustomerTaxDataPage } from "./AddCustomerTaxData";

const customer = customerFactory.build({ id: "2000" });

const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomersProvider>
        <MemoryRouter initialEntries={["/tax-data/" + customer.id]}>
          <Routes>
            <Route path="/tax-data/:id" element={<AddCustomerTaxDataPage />} />
            <Route path="/customers/:id" element={<div>Customer Page</div>} />
          </Routes>
        </MemoryRouter>
      </CustomersProvider>
    </ThemeProvider>
  );
};

describe("AddCustomerTaxDataPage", () => {
  it("displays the add customer tax data page", () => {
    mountComponent();
    cy.contains("Add tax data");
  });

  it("displays taxId is a required field when send form with taxId field empty", () => {
    mountComponent();
    const invalidTaxData = {
      taxId: "",
      companyName: "Amex",
      companyAddress: "London Way",
    };
    cy.get('input[name="companyName"]').type(invalidTaxData.companyName);
    cy.get('input[name="companyAddress"]').type(
      `${invalidTaxData.companyAddress}{enter}`
    );
    cy.contains("Tax ID field cannot be empty");
  });

  it("displays companyAddress is a required field when send form with companyAddress field empty", () => {
    mountComponent();
    const invalidTaxData = {
      taxId: "22",
      companyName: "Amez",
      companyAddress: "",
    };
    cy.get('input[name="taxId"]').type(invalidTaxData.taxId);
    cy.get('input[name="companyName"]').type(invalidTaxData.companyName);
    cy.get('input[name="companyAddress"]').type(
      `${invalidTaxData.companyAddress}{enter}`
    );
    cy.contains("Company Address field cannot be empty");
  });

  it("navigates to the Customer Page when the tax data is saved", () => {
    mountComponent();
    const validTaxData = {
      taxId: "200",
      companyName: "Amex",
      companyAddress: "London Way",
    };
    cy.get('input[name="taxId"]').type(validTaxData.taxId);
    cy.get('input[name="companyName"]').type(validTaxData.companyName);
    cy.get('input[name="companyAddress"]').type(validTaxData.companyAddress);
    cy.contains("Save").click();
    cy.stub(API, "post").resolves({
      taxData: validTaxData,
    });
    cy.contains("Customer Page");
  });
});
