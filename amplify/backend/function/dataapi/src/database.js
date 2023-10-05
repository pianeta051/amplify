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
      name_lowercase: {
        S: customer.name?.toLowerCase(),
      },
      email: {
        S: customer.email,
      },
      email_lowercase: {
        S: customer.email?.toLowerCase(),
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

const getCustomers = async (
  exclusiveStartKey,
  limit,
  searchInput,
  customerType
) => {
  let params = {
    TableName: "customers-ex-dev",
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  };

  let ExpressionAttributeNames = undefined;
  const FilterExpressions = [];
  let ExpressionAttributeValues = undefined;

  if (searchInput?.length) {
    if (!ExpressionAttributeNames) {
      ExpressionAttributeNames = {};
    }
    ExpressionAttributeNames = {
      ...ExpressionAttributeNames,
      "#NL": "name_lowercase",
      "#EL": "email_lowercase",
    };
    if (!ExpressionAttributeValues) {
      ExpressionAttributeValues = {};
    }
    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      ":name": { S: searchInput.toLowerCase() },
      ":email": { S: searchInput.toLowerCase() },
    };
    FilterExpressions.push("contains(#NL, :name) OR contains(#EL, :email)");
  }

  if (customerType?.length) {
    if (!ExpressionAttributeNames) {
      ExpressionAttributeNames = {};
    }
    ExpressionAttributeNames = {
      ...ExpressionAttributeNames,
      "#T": "type",
    };
    if (!ExpressionAttributeValues) {
      ExpressionAttributeValues = {};
    }
    ExpressionAttributeValues = {
      ...ExpressionAttributeValues,
      ":type": { S: customerType },
    };
    FilterExpressions.push("#T = :type");
  }

  let FilterExpression = undefined;
  if (FilterExpressions.length) {
    FilterExpression = FilterExpressions.map(
      (expression) => `(${expression})`
    ).join(" AND ");
  }

  params = {
    ...params,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    FilterExpression,
  };

  console.log(params);

  let result = await ddb.scan(params).promise();
  const items = result.Items;

  while (result.LastEvaluatedKey && items.length < limit) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }

  const nextItem = await getNextCustomer(result.LastEvaluatedKey);
  return {
    items,
    lastEvaluatedKey: nextItem ? result.LastEvaluatedKey : null,
  };
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

const getNextCustomer = async (lastEvaluatedKey) => {
  const params = {
    TableName: "customers-ex-dev",
    Limit: 1,
    ExclusiveStartKey: lastEvaluatedKey,
  };
  const result = await ddb.scan(params).promise();
  if (result.Items.length) {
    const item = result.Items[0];
    return item;
  }
  return null;
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
      "#NL": "name_lowercase",
      "#E": "email",
      "#EL": "email_lowercase",
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
      ":name_lowercase": {
        S: updatedCustomer.name?.toLowerCase(),
      },
      ":email_lowercase": {
        S: updatedCustomer.email?.toLowerCase(),
      },
    },
    UpdateExpression:
      "SET #N = :name, #E = :email, #T = :type, #NL = :name_lowercase, #EL = :email_lowercase ",
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
