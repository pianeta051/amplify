/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const {
  addExternalLinkToCustomer,
  addMainAddress,
  addTaxData,
  addVoucher,
  createCustomer,
  deleteCustomer,
  deleteTaxData,
  deleteVoucher,
  deleteCustomerMainAddress,
  deleteCustomerExternalLink,
  getCustomers,
  getCustomer,
  updateCustomer,
  updateTaxData,
  updateVoucher,
  updateMainAddress,
  updateExternalLink,
  getCustomerMainAddress,
} = require("./database");

const { mapCustomer, mapCustomerAddress } = require("./mappers");

const { generateToken, parseToken } = require("./token");
const { stringify } = require("querystring");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// delete a customer
app.delete("/customers/:id", async function (req, res) {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.delete("/customers/:id/address_main", async function (req, res) {
  try {
    const customerId = req.params.id;
    await deleteCustomerMainAddress(customerId);
    res.json({ message: `Main Address removed for ${customerId}` });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.delete("/customers/:id/tax-data", async function (req, res) {
  try {
    const customerId = req.params.id;
    await deleteTaxData(customerId);
    res.json({ message: `Tax data removed for ${customerId}` });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.delete("/customers/:id/voucher-detail", async function (req, res) {
  try {
    const customerId = req.params.id;
    await deleteVoucher(customerId);
    res.json({ message: `Voucher removed for ${customerId}` });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.delete("/customers/:id/external-link/:index", async function (req, res) {
  try {
    const customerId = req.params.id;
    const index = req.params.index;
    await deleteCustomerExternalLink(customerId, index);
    res.json({ message: `External link Deleted` });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

// List all customers
app.get("/customers", async function (req, res) {
  const nextToken = req.query?.nextToken;
  const limit = req.query?.limit ? +req.query?.limit : 5;
  const search = req.query?.search;
  const customerTypes = req.query?.customerTypes
    ? JSON.parse(req.query?.customerTypes)
    : undefined;
  const exclusiveStartKey = parseToken(nextToken);
  const { items, lastEvaluatedKey } = await getCustomers(
    exclusiveStartKey,
    limit,
    search,
    customerTypes
  );
  const customers = items.map(mapCustomer);
  const responseToken = generateToken(lastEvaluatedKey);
  res.json({ customers, nextToken: responseToken });
});

// Get a single customer
app.get("/customers/:id", async function (req, res) {
  const id = req.params.id;
  const customerFromDb = await getCustomer(id);
  if (customerFromDb) {
    const customer = mapCustomer(customerFromDb);
    res.json({ customer });
  } else {
    res.status(404).json({
      error: "Customer not registered!",
    });
  }
});

// Get a single customer's main address
app.get("/customers/:id/main-address", async function (req, res) {
  const id = req.params.id;
  try {
    const mainAddressFromDb = await getCustomerMainAddress(id);
    if (mainAddressFromDb) {
      const mainAddress = mapCustomerAddress(mainAddressFromDb);
      res.json({ mainAddress });
    } else {
      res.json({ mainAddress: null });
    }
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

// Create a new customer
app.post("/customers", async function (req, res) {
  try {
    const createdCustomer = await createCustomer(req.body);
    res.json({ customer: createdCustomer });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({
        error: "Email Already Exists",
      });
    } else if (error.message === "EMAIL_CANNOT_BE_EMPTY") {
      res.status(400).json({
        error: "Email cannot be empty",
      });
    } else {
      throw error;
    }
  }
});

app.post("/customers/:id/external-link", async function (req, res) {
  try {
    const customerId = req.params.id;
    const { url } = req.body;
    const insertedUrl = await addExternalLinkToCustomer(customerId, url);
    res.json({ url: insertedUrl });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/customers/:id/main-address", async function (req, res) {
  try {
    const customerId = req.params.id;
    const mainAddress = req.body;
    const createdMainAddress = await addMainAddress(customerId, mainAddress);
    res.json({ mainAddress: createdMainAddress });
  } catch (error) {
    throw error;
  }
});

// add tax data to an existing customer
app.post("/customers/:id/tax-data", async function (req, res) {
  try {
    const customerId = req.params.id;
    const taxData = req.body;
    const createdTaxData = await addTaxData(customerId, taxData);
    res.json({ taxData: createdTaxData });
  } catch (error) {
    if (error.message === "TAX_ID_CANNOT_BE_EMPTY") {
      res.status(400).json({
        error: "Tax ID cannot be empty",
      });
    } else if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});
// add voucher to an existing customer
app.post("/customers/:id/voucher-detail", async function (req, res) {
  try {
    const customerId = req.params.id;
    const voucher = req.body;
    const createdVoucher = await addVoucher(customerId, voucher);
    res.json({ voucher: createdVoucher });
  } catch (error) {
    if (error.message === "VOUCHER_ID_CANNOT_BE_EMPTY") {
      res.status(400).json({
        error: "Voucher ID cannot be empty",
      });
    } else if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

// Update a customer
app.put("/customers/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const updatedCustomer = await updateCustomer(id, req.body);
    res.json({ customer: updatedCustomer });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({
        error: "Email Already Exists",
      });
    } else if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.put("/customers/:id/tax-data", async function (req, res) {
  try {
    const taxData = req.body;
    const customerId = req.params.id;
    const updatedTaxData = await updateTaxData(customerId, taxData);
    res.json({ taxData: updatedTaxData });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.put("/customers/:id/voucher-detail", async function (req, res) {
  try {
    const voucher = req.body;
    const customerId = req.params.id;
    const updatedVoucher = await updateVoucher(customerId, voucher);
    res.json({ voucher: updatedVoucher });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.put("/customers/:id/main-address", async function (req, res) {
  try {
    const mainAddress = req.body;
    const customerId = req.params.id;
    const updatedMainAddress = await updateMainAddress(customerId, mainAddress);
    res.json({ mainAddress: updatedMainAddress });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});
app.put("/customers/:id/external-link/:index", async function (req, res) {
  try {
    const customerId = req.params.id;
    const index = req.params.index;
    const { url } = req.body;
    console.log(`customer: ${customerId}, index: ${index}, url: ${url}`);
    const updatedExternalLink = await updateExternalLink(
      customerId,
      url,
      +index
    );

    res.json({ url: updatedExternalLink });
  } catch (error) {
    if (error.message === "Customer not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    throw error;
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
