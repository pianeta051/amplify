const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const createCustomer = async (customer) => {
  if (!customer.email?.length) {
    throw new Error("EMAIL_CANNOT_BE_EMPTY");
  }

  const emailExisting = await queryCustomersByEmail(customer.email);

  if (emailExisting.length > 0) {
    console.log("Customer already exist");
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }

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

const deleteCustomer = async (id) => {
  const params = {
    TableName: "customers-ex-dev",
    Key: {
      id: { S: id },
    },
  };
  await ddb.deleteItem(params).promise();
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

const queryCustomersByEmail = async (email) => {
  const params = {
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
    KeyConditionExpression: "email = :email",
    TableName: "customers-ex-dev",
    IndexName: "search_by_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items;
};

const updateCustomer = async (id, updatedCustomer) => {
  const emailExisting = await queryCustomersByEmail(updatedCustomer.email);
  console.log(JSON.stringify(emailExisting, null, 2));

  if (
    emailExisting.length > 0 &&
    !emailExisting.find((item) => item.id.S === id)
  ) {
    console.log("Customer already exist");

    throw new Error("EMAIL_ALREADY_REGISTERED");
  }
  const params = {
    TableName: "customers-ex-dev",
    ExpressionAttributeNames: {
      "#N": "name",
      "#E": "email",
      "#T": "type",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: updatedCustomer.name,
      },
      ":email": {
        S: updatedCustomer.email,
      },
      ":type": {
        S: updatedCustomer.type,
      },
    },
    UpdateExpression: "SET #N = :name, #E = :email, #T = :type",
    Key: {
      id: { S: id },
    },
  };
  await ddb.updateItem(params).promise();
  return {
    id,
    ...updatedCustomer,
  };
};

module.exports = {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  queryCustomersByEmail,
  updateCustomer,
};
