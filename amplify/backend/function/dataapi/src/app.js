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
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
} = require("./database");

const { generateToken, parseToken } = require("./token");

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

const mapCustomer = (customerFromDb) => ({
  id: customerFromDb.id.S,
  name: customerFromDb.name.S,
  email: customerFromDb.email.S,
  type: customerFromDb.type.S,
});

// List all customers
app.get("/customers", async function (req, res) {
  const nextToken = req.query?.nextToken;
  const limit = req.query?.limit ? +req.query?.limit : 5;
  const search = req.query?.search;
  const customerType = req.query?.customerType;
  const exclusiveStartKey = parseToken(nextToken);
  const { items, lastEvaluatedKey } = await getCustomers(
    exclusiveStartKey,
    limit,
    search,
    customerType
  );
  const customers = items.map(mapCustomer);
  const responseToken = generateToken(lastEvaluatedKey);
  res.json({ customers, nextToken: responseToken });
});

// Get a single customer
app.get("/customers/*", async function (req, res) {
  const id = req.params[0];
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

// Update a customer
app.put("/customers/*", async function (req, res) {
  try {
    const id = req.params[0];
    const updatedCustomer = await updateCustomer(id, req.body);
    res.json({ customer: updatedCustomer });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({
        error: "Email Already Exists",
      });
    } else {
      throw error;
    }
  }
});

// delete a customer
app.delete("/customers/*", async function (req, res) {
  const id = req.params[0];
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.listen(3000, function () {
  console.log("App started");
});

//USERS
// Create a new user
app.post("/users", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
