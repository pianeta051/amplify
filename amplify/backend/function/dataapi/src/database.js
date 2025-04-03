const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const TABLE_NAME = "exercises-dev";
const PAGE_SIZE = 5;

const addExternalLinkToCustomer = async (customerId, url) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "profile",
      },
    },
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
    },
    ExpressionAttributeValues: {
      ":url": { L: [{ S: url }] },
      ":empty_list": { L: [] },
    },
    UpdateExpression:
      "SET #EL = list_append(if_not_exists(#EL, :empty_list), :url)",
  };
  await ddb.updateItem(params).promise();
  return url;
};

const addMainAddress = async (customerId, mainAddress) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "address_main",
      },
      street: { S: mainAddress.street },
      city: { S: mainAddress.city },
      number: { S: mainAddress.number },
      postcode: { S: mainAddress.postcode },
    },
  };
  await ddb.putItem(params).promise();
  return mainAddress;
};

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

const addVoucher = async (customerId, voucher) => {
  if (!voucher.voucherId?.length) {
    throw new Error("VOUCHER_ID_CANNOT_BE_EMPTY");
  }
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    ExpressionAttributeNames: {
      "#V": "voucher",
    },
    ExpressionAttributeValues: {
      ":voucher": {
        M: {
          voucherId: {
            S: voucher.voucherId,
          },
          value: {
            N: voucher.value.toString(),
          },
          type: {
            S: voucher.type,
          },
        },
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: { S: "profile" },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "SET #V = :voucher",
  };
  await ddb.updateItem(params).promise();
  return voucher;
};

const createCustomer = async (customer) => {
  if (!customer.email?.length) {
    throw new Error("EMAIL_CANNOT_BE_EMPTY");
  }

  const emailExisting = await queryCustomersByEmail(customer.email);

  if (emailExisting.length > 0) {
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

  await ddb.putItem(params).promise();
  return {
    ...customer,
    id,
  };
};

const createCustomerSecondaryAddress = async (customerId, address) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const addressId = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
      street: { S: address.street },
      city: { S: address.city },
      number: { S: address.number },
      postcode: { S: address.postcode },
    },
  };
  await ddb.putItem(params).promise();
  return { ...address, id: addressId };
};

const createJob = async (job, assignedTo) => {
  const id = uuid.v1();
  const addresses = job.addresses;
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: `job_${id}`,
      },
      SK: {
        S: "description",
      },
      assigned_to: {
        S: assignedTo,
      },
      name: {
        S: job.name,
      },
      start: {
        N: job.start.toString(),
      },
      end: {
        N: job.end.toString(),
      },
    },
  };

  await ddb.putItem(params).promise();

  // Bucle que vaya creando las filas para las addresses
  for (let index = 0; index < addresses.length; index++) {
    const addressParams = {
      TableName: TABLE_NAME,
      Item: {
        PK: {
          S: `job_${id}`,
        },
        SK: {
          S: `address_assignation_${index}`,
        },
        address_id: {
          S: addresses[index].addressId,
        },
        customer_id: {
          S: addresses[index].customerId,
        },
      },
    };
    await ddb.putItem(addressParams).promise();
  }

  return {
    ...job,
    id,
  };
};

const deleteTaxData = async (customerId) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    ExpressionAttributeNames: {
      "#TD": "taxData",
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
    UpdateExpression: "REMOVE #TD",
  };
  await ddb.updateItem(params).promise();
};

const deleteVoucher = async (customerId) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    ExpressionAttributeNames: {
      "#V": "voucher",
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: { S: "profile" },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "REMOVE #V",
  };
  await ddb.updateItem(params).promise();
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
  await deleteCustomerMainAddress(id);
};

const deleteCustomerMainAddress = async (id) => {
  const deleteAddressRowParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "address_main" },
    },
  };
  await ddb.deleteItem(deleteAddressRowParams).promise();
  const searchParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#SK": "SK",
      "#AI": "address_id",
      "#CI": "customer_id",
    },
    ExpressionAttributeValues: {
      ":sk": { S: `address_assignation` },
      ":ai": { S: "main" },
      ":ci": { S: customerId },
    },
    FilterExpression: "begins_with(#SK, :sk) and #AI = :ai and #CI = :ci",
  };
  const items = await getAllRows(searchParams);

  for (const item of items) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: { S: item.PK.S }, SK: { S: item.SK.S } },
    };
    await ddb.deleteItem(params).promise();
  }
};

const deleteCustomerExternalLink = async (customerId, index) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }
  const params = {
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
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
    UpdateExpression: `REMOVE #EL[${index}]`,
  };
  await ddb.updateItem(params).promise();
};

const deleteJob = async (jobId) => {
  const searchParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${jobId}` },
    },
    FilterExpression: "#PK =:pk",
  };
  const items = await getAllRows(searchParams);

  for (const item of items) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: { S: item.PK.S }, SK: { S: item.SK.S } },
    };
    await ddb.deleteItem(params).promise();
  }
};

const deleteSecondaryAddressFromCustomer = async (customerId, addressId) => {
  // Delete the address row
  const deleteAddressRowParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
    },
  };
  await ddb.deleteItem(deleteAddressRowParams).promise();
  // Delete the address assignations
  const searchParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#SK": "SK",
      "#AI": "address_id",
      "#CI": "customer_id",
    },
    ExpressionAttributeValues: {
      ":sk": { S: `address_assignation` },
      ":ai": { S: addressId },
      ":ci": { S: customerId },
    },
    FilterExpression: "begins_with(#SK, :sk) and #AI = :ai and #CI = :ci",
  };
  const items = await getAllRows(searchParams);

  for (const item of items) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: { S: item.PK.S }, SK: { S: item.SK.S } },
    };
    await ddb.deleteItem(params).promise();
  }
};

const getAddressJobIDs = async (addressId, customerId) => {
  const params = {
    FilterExpression: "#AI = :ai AND #CI = :ci",
    ExpressionAttributeNames: {
      "#AI": "address_id",
      "#CI": "customer_id",
    },
    ExpressionAttributeValues: {
      ":ai": { S: addressId },
      ":ci": { S: customerId },
    },
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
  };
  const items = await getAllRows(params);

  const jobIds = items.map((item) => item.PK.S.split("_")[1]);
  return jobIds;
};

const getAddresses = async (
  exclusiveStartKey,
  searchInput,
  excludedAddresses,
  includedAddresses
) => {
  let params = {
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
    ExclusiveStartKey: exclusiveStartKey,
  };

  let searchParams = {
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "address_" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND begins_with(#SK, :sk)",
  };

  if (searchInput) {
    searchParams = {
      ExpressionAttributeNames: {
        ...searchParams.ExpressionAttributeNames,
        "#S": "street",
      },
      ExpressionAttributeValues: {
        ...searchParams.ExpressionAttributeValues,
        ":street": { S: searchInput.toLowerCase() },
      },
      FilterExpression:
        searchParams.FilterExpression + " AND contains(#S, :street)",
    };
  }

  if (includedAddresses?.length) {
    const filterExpressions = [];
    for (let i = 0; i < includedAddresses.length; i++) {
      const includedAddress = includedAddresses[i];
      searchParams = {
        ...searchParams,
        ExpressionAttributeValues: {
          ...searchParams.ExpressionAttributeValues,
          [`:includedAddressId${i}`]: { S: includedAddress.addressId },
          [`:includedCustomerId${i}`]: {
            S: includedAddress.customerId,
          },
        },
      };
      filterExpressions.push(
        `(contains(#SK, :includedAddressId${i}) AND contains(#PK, :includedCustomerId${i}))`
      );
    }
    searchParams = {
      ...searchParams,
      FilterExpression: `${searchParams.FilterExpression} AND ${
        filterExpressions.length > 1 ? "(" : ""
      }${filterExpressions.join(" OR ")}${
        filterExpressions.length > 1 ? ")" : ""
      }`,
    };
  } else if (excludedAddresses?.length) {
    for (let i = 0; i < excludedAddresses.length; i++) {
      const excludedAddress = excludedAddresses[i];
      searchParams = {
        ...searchParams,
        ExpressionAttributeValues: {
          ...searchParams.ExpressionAttributeValues,
          [`:excludedAddressId${i}`]: { S: excludedAddress.addressId },
          [`:excludedCustomerId${i}`]: {
            S: excludedAddress.customerId,
          },
        },
        FilterExpression: `${searchParams.FilterExpression} AND (NOT contains(#SK, :excludedAddressId${i}) OR NOT contains(#PK, :excludedCustomerId${i}))`,
      };
    }
  }

  params = {
    ...params,
    ...searchParams,
  };

  let result = await ddb.scan(params).promise();
  const items = result.Items;
  while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: PAGE_SIZE - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }

  const nextItem = await getNextValue(result.LastEvaluatedKey, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return {
    items,
    lastEvaluatedKey: nextItem ? result.LastEvaluatedKey : null,
  };
};

const getAllRows = async (params) => {
  let result = await ddb.scan(params).promise();
  const items = result.Items;
  while (result.LastEvaluatedKey) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }
  return items;
};

const getCustomerAddresses = async (customerId, exclusiveStartKey) => {
  const items = [];
  let pageSize = 5;
  if (!exclusiveStartKey) {
    const mainAddress = await getCustomerMainAddress(customerId);
    if (mainAddress) {
      items.push({ ...mainAddress, SK: { S: "address_secondary_main" } });
      pageSize = 4;
    }
  }
  const { items: secondaryAddresses, lastEvaluatedKey } =
    await getCustomerSecondaryAddresses(
      customerId,
      exclusiveStartKey,
      pageSize
    );
  items.push(...secondaryAddresses);
  return { items, lastEvaluatedKey };
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

  let ExpressionAttributeNames = {
    "#PK": "PK",
    "#SK": "SK",
  };
  const FilterExpressions = ["begins_with(#PK, :pk) AND #SK = :sk"];
  let ExpressionAttributeValues = {
    ":pk": { S: "customer_" },
    ":sk": { S: "profile" },
  };

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

  const nextItem = await getNextValue(result.LastEvaluatedKey, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
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

const getCustomerMainAddress = async (customerId) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "address_main" },
    },
  };
  const mainAddress = await ddb.getItem(params).promise();
  return mainAddress.Item;
};

const getCustomerSecondaryAddresses = async (
  customerId,
  exclusiveStartKey,
  pageSize = 5
) => {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "address_secondary_" },
    },
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    KeyConditionExpression: "#PK = :pk AND begins_with(#SK, :sk)",
    Limit: pageSize,
    ExclusiveStartKey: exclusiveStartKey,
  };
  const result = await ddb.query(params).promise();
  const nextItem = await getNextValue(result.LastEvaluatedKey, {
    filterExpression: params.KeyConditionExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return {
    items: result.Items,
    lastEvaluatedKey: nextItem ? result.LastEvaluatedKey : null,
  };
};

const getCustomerSecondaryAddress = async (customerId, addressId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return result.Item;
};

const getJob = async (jobId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `job_${jobId}` },
      SK: { S: "description" },
    },
  };
  const result = await ddb.getItem(params).promise();
  return result.Item;
};

const getJobs = async (filters, order, exclusiveStartKey, paginate) => {
  const { addressId, customerId, from, to, assignedTo } = filters;
  const params = {
    TableName: TABLE_NAME,
    IndexName: "job_start_time",
    ScanIndexForward: order !== "desc", // cuando order es undefined, esto se pone a true, por lo que el default seria true
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": { S: "description" },
    },
    KeyConditionExpression: "#SK = :sk",
  };

  if (paginate) {
    params.ExclusiveStartKey = exclusiveStartKey;
    params.Limit = 15;
  }

  const filterExpressions = [];

  if (assignedTo) {
    const filterExpression = "#AT = :assigned_to";
    params.ExpressionAttributeNames["#AT"] = "assigned_to";
    params.ExpressionAttributeValues[":assigned_to"] = { S: assignedTo };
    filterExpressions.push(filterExpression);
  }

  if (addressId && customerId) {
    const jobIds = await getAddressJobIDs(addressId, customerId);
    if (jobIds.length === 0) {
      return {
        items: [],
      };
    }
    for (let i = 0; i < jobIds.length; i++) {
      const id = jobIds[i];
      params.ExpressionAttributeValues[`:jobId${i}`] = { S: `job_${id}` };
    }
    const filterExpression = `#PK IN (${jobIds
      .map((_id, index) => `:jobId${index}`)
      .join(", ")})`;
    filterExpressions.push(filterExpression);
  } else {
    params.ExpressionAttributeValues[":pk"] = { S: "job_" };
    const filterExpression = "begins_with(#PK, :pk)";
    filterExpressions.push(filterExpression);
  }

  if (from && to) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":from"] = {
      N: from.toString(),
    };
    params.ExpressionAttributeValues[":to"] = {
      N: to.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S BETWEEN :from AND :to`;
  } else if (from) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":from"] = {
      N: from.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S >= :from`;
  } else if (to) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":to"] = {
      N: to.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S <= :to`;
  }

  if (filterExpressions.length) {
    params.FilterExpression = filterExpressions
      .map((e) => `(${e})`)
      .join(" AND ");
  }

  let result = await ddb.query(params).promise();
  const items = result.Items;
  let lastEvaluatedKey;

  if (paginate) {
    // Extract enough items to fill a page
    while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
      result = await ddb
        .query({
          ...params,
          ExclusiveStartKey: result.LastEvaluatedKey,
          Limit: PAGE_SIZE - items.length,
        })
        .promise();
      items.push(...result.Items);
    }
    const nextItem = await ddb
      .query({
        ...params,
        ExclusiveStartKey: result.LastEvaluatedKey,
        Limit: 1,
      })
      .promise();
    if (nextItem.Items.length > 0) {
      lastEvaluatedKey = result.LastEvaluatedKey;
    }
  } else {
    // Extract all items
    while (result.LastEvaluatedKey && result.Items.length > 0) {
      result = await ddb
        .query({
          ...params,
          ExclusiveStartKey: result.LastEvaluatedKey,
        })
        .promise();
      items.push(...result.Items);
    }
  }

  return {
    items,
    lastEvaluatedKey,
  };
};

const getJobAddresses = async (jobId, exclusiveStartKey) => {
  let params = {
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
    ExclusiveStartKey: exclusiveStartKey,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${jobId}` },
      ":sk": { S: "address_assignation" },
    },
    FilterExpression: "#PK = :pk AND begins_with(#SK, :sk)",
  };

  let result = await ddb.scan(params).promise();
  const items = result.Items;
  while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: PAGE_SIZE - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }

  const nextItem = await getNextValue(result.LastEvaluatedKey, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });

  const lastEvaluatedKey = nextItem ? result.LastEvaluatedKey : null;

  // Antes de aqui
  const addresses = [];

  for (const item of items) {
    const addressId = item.address_id.S;
    const customerId = item.customer_id.S;
    if (addressId === "main") {
      const mainAddress = await getCustomerMainAddress(customerId);
      addresses.push(mainAddress);
    } else {
      const secondaryAddress = await getCustomerSecondaryAddress(
        customerId,
        addressId
      );
      addresses.push(secondaryAddress);
    }
  }
  return { addresses, lastEvaluatedKey };
};

const getNextValue = async (lastEvaluatedKey, filter) => {
  const params = {
    TableName: TABLE_NAME,
    ExclusiveStartKey: lastEvaluatedKey,
    FilterExpression: filter.filterExpression,
    ExpressionAttributeNames: filter.expressionAttributeNames,
    ExpressionAttributeValues: filter.expressionAttributeValues,
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

const updateTaxData = async (customerId, updatedTaxData) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#TD": "taxData",
    },
    ExpressionAttributeValues: {
      ":taxData": {
        M: {
          taxId: { S: updatedTaxData.taxId },
          companyName: { S: updatedTaxData.companyName },
          companyAddress: { S: updatedTaxData.companyAddress },
        },
      },
    },
    UpdateExpression: "SET #TD = :taxData",
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "profile" },
    },
  };
  await ddb.updateItem(params).promise();
  return updatedTaxData;
};

const updateVoucher = async (customerId, updatedVoucher) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#V": "voucher",
    },
    ExpressionAttributeValues: {
      ":voucher": {
        M: {
          voucherId: { S: updatedVoucher.voucherId },
          value: { N: updatedVoucher.value.toString() },
          type: { S: updatedVoucher.type },
        },
      },
    },
    UpdateExpression: "SET #V = :voucher",
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "profile" },
    },
  };
  await ddb.updateItem(params).promise();
  return updatedVoucher;
};

const updateMainAddress = async (customerId, updatedMainAddress) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#S": "street",
      "#C": "city",
      "#P": "postcode",
      "#N": "number",
    },
    ExpressionAttributeValues: {
      ":street": { S: updatedMainAddress.street },
      ":city": { S: updatedMainAddress.city },
      ":postcode": { S: updatedMainAddress.postcode },
      ":number": { S: updatedMainAddress.number },
    },
    UpdateExpression:
      "SET #S = :street, #C = :city, #P = :postcode, #N = :number",
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "address_main" },
    },
  };
  await ddb.updateItem(params).promise();
  return updatedMainAddress;
};

const updateExternalLink = async (customerId, url, index) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "profile",
      },
    },
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
    },
    ExpressionAttributeValues: {
      ":url": { S: url },
    },
    UpdateExpression: `SET #EL[${index}] = :url`,
  };
  await ddb.updateItem(params).promise();
  return url;
};

const updateSecondaryAddress = async (
  customerId,
  secondaryAddress,
  addressId
) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#S": "street",
      "#C": "city",
      "#P": "postcode",
      "#N": "number",
    },
    ExpressionAttributeValues: {
      ":street": { S: secondaryAddress.street },
      ":city": { S: secondaryAddress.city },
      ":postcode": { S: secondaryAddress.postcode },
      ":number": { S: secondaryAddress.number },
    },
    UpdateExpression:
      "SET #S = :street, #C = :city, #P = :postcode, #N = :number",
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
    },
  };
  await ddb.updateItem(params).promise();
  return secondaryAddress;
};

//Update Job
const updateJob = async (id, updatedJob) => {
  const job = await getJob(id);
  if (!job) {
    throw new Error("JOB_NOT_FOUND");
  }

  const updateJobParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#N": "name",
      "#ST": "start",
      "#ET": "end",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: updatedJob.name,
      },
      ":start": {
        N: updatedJob.start.toString(),
      },
      ":end": {
        N: updatedJob.end.toString(),
      },
    },
    UpdateExpression: "SET #N = :name, #ST = :start, #ET = :end",
    Key: {
      PK: { S: `job_${id}` },
      SK: { S: "description" },
    },
  };
  if (updatedJob.imageKey) {
    updateJobParams.ExpressionAttributeNames["#IK"] = "image_key";
    updateJobParams.ExpressionAttributeValues[":image_key"] = {
      S: updatedJob.imageKey,
    };
    updateJobParams.UpdateExpression += ", #IK = :image_key";
  }

  await ddb.updateItem(updateJobParams).promise();

  // Borrar todos los address_assignation que tiene ahora mismo (ya lo hacemos en delete job)
  const searchAddressParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${id}` },
      ":sk": { S: "address_assignation_" },
    },
    FilterExpression: "#PK =:pk  AND begins_with(#SK, :sk)",
  };
  const items = await getAllRows(searchAddressParams);

  for (const item of items) {
    const deleteAdressParams = {
      TableName: TABLE_NAME,
      Key: { PK: { S: item.PK.S }, SK: { S: item.SK.S } },
    };
    await ddb.deleteItem(deleteAdressParams).promise();
  }
  // Insertar todos los address_assignation que vienen en el body (ya lo hacemos en create job)
  // Bucle que vaya creando las filas para las addresses

  const addresses = updatedJob.addresses;
  for (let index = 0; index < addresses.length; index++) {
    const addressParams = {
      TableName: TABLE_NAME,
      Item: {
        PK: {
          S: `job_${id}`,
        },
        SK: {
          S: `address_assignation_${index}`,
        },
        address_id: {
          S: addresses[index].addressId,
        },
        customer_id: {
          S: addresses[index].customerId,
        },
      },
    };
    await ddb.putItem(addressParams).promise();
  }
  return {
    id,
    ...updatedJob,
  };
};
module.exports = {
  addExternalLinkToCustomer,
  addMainAddress,
  addTaxData,
  addVoucher,
  createCustomer,
  createCustomerSecondaryAddress,
  createJob,
  deleteCustomer,
  deleteVoucher,
  deleteTaxData,
  deleteCustomerExternalLink,
  deleteCustomerMainAddress,
  deleteJob,
  deleteSecondaryAddressFromCustomer,
  getAddresses,
  getCustomer,
  getCustomerAddresses,
  getCustomers,
  getCustomerMainAddress,
  getCustomerSecondaryAddress,
  getCustomerSecondaryAddresses,
  getJob,
  getJobAddresses,
  getJobs,
  queryCustomersByEmail,
  updateCustomer,
  updateJob,
  updateTaxData,
  updateVoucher,
  updateMainAddress,
  updateExternalLink,
  updateSecondaryAddress,
};
