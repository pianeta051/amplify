const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const TABLE_NAME = "exercises-dev";

const addTaxData = async (customerId, taxData) => {
  if (!taxData.taxId?.length) {
    throw new Error("TAX_ID_CANNOT_BE_EMPTY");
  }
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    ExpressionAttributeNames: {
      "#TD": "taxData",
    },
    ExpressionAttributeValues: {
      ":taxData": {
        M: {
          taxId: {
            S: taxData.taxId,
          },
          companyName: {
            S: taxData.companyName,
          },
          companyAddress: {
            S: taxData.companyAddress,
          },
        },
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "profile",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "SET #TD = :taxData",
  };
  await ddb.updateItem(params).promise();
  return taxData;
};

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
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: `customer_${id}`,
      },
      SK: {
        S: "profile",
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
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  await ddb.deleteItem(params).promise();
};

const getCustomers = async (
  exclusiveStartKey,
  limit,
  searchInput,
  customerTypes
) => {
  let params = {
    TableName: TABLE_NAME,
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
    FilterExpressions.push("(contains(#NL, :name) OR contains(#EL, :email))");
  }

  if (customerTypes?.length) {
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

    const clauses = [];
    for (let i = 0; i < customerTypes.length; i++) {
      const customerType = customerTypes[i];
      const attributeName = `:type${i}`;
      ExpressionAttributeValues = {
        ...ExpressionAttributeValues,
        [attributeName]: { S: customerType },
      };
      clauses.push(`(#T = :type${i})`);
    }

    // Join with OR
    let expression = clauses.join(" OR ");
    if (clauses.length > 1) {
      expression = `(${expression})`;
    }
    FilterExpressions.push(expression);
  }

  let FilterExpression = undefined;
  if (FilterExpressions.length) {
    FilterExpression = FilterExpressions.join(" AND ");
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
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  const customer = await ddb.getItem(params).promise();
  return customer.Item;
};

const getNextCustomer = async (lastEvaluatedKey) => {
  const params = {
    TableName: TABLE_NAME,
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
      ":email": { S: email.toLowerCase() },
    },
    KeyConditionExpression: "email_lowercase = :email",
    TableName: TABLE_NAME,
    IndexName: "customer_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items;
};

const updateCustomer = async (id, updatedCustomer) => {
  const customer = await getCustomer(id);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const emailExisting = await queryCustomersByEmail(updatedCustomer.email);

  if (
    emailExisting.length > 0 &&
    !emailExisting.find((item) => item.PK.S === `customer_${id}`)
  ) {
    console.log("Customer already exist");

    throw new Error("EMAIL_ALREADY_REGISTERED");
  }
  const params = {
    TableName: TABLE_NAME,
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
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  await ddb.updateItem(params).promise();
  return {
    id,
    ...updatedCustomer,
  };
};

module.exports = {
  addTaxData,
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  queryCustomersByEmail,
  updateCustomer,
};
