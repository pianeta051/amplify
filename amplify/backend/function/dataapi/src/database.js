const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const createCustomer = async (customer) => {
  const id = uuid.v1();

  const params = {
    TableName: "customers-ex-dev",
    Item: {
      id: {
        S: id,
      },
      name: {
        S: customer.name,
      },
      email: {
        S: customer.email,
      },
      type: {
        S: customer.type,
      },
    },
  };
  const data = await ddb.putItem(params).promise();
  console.log("Customer created", data);
  return {
    ...customer,
    id,
  };
};

const getCustomers = async () => {
  const params = {
    TableName: "customers-ex-dev",
  };

  const scanResults = [];
  let items;
  do {
    items = await ddb.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");

  return scanResults;
};

const getCustomer = async (id) => {
  const params = {
    TableName: "customers-ex-dev",
    Key: {
      id: { S: id },
    },
  };
  const customer = await ddb.getItem(params).promise();
  return customer.Item;
};

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
};
