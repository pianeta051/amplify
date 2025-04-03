const dayjs = require("dayjs");

const mapAddressIDsFromQuery = (query) => {
  const ids =
    query
      ?.split(",")
      .filter((id) => id.length > 0)
      .map((compositeId) => {
        const [customerId, addressId] = compositeId.split("_");
        return { customerId, addressId };
      }) ?? [];
  return ids;
};

const mapCustomer = (customerFromDb) => ({
  id: customerFromDb.PK.S.replace("customer_", ""),
  name: customerFromDb.name.S,
  email: customerFromDb.email.S,
  type: customerFromDb.type.S,
  taxData: customerFromDb.taxData
    ? {
        taxId: customerFromDb.taxData.M.taxId.S,
        companyName: customerFromDb.taxData.M.companyName.S,
        companyAddress: customerFromDb.taxData.M.companyAddress.S,
      }
    : undefined,
  voucher: customerFromDb.voucher
    ? {
        voucherId: customerFromDb.voucher.M.voucherId.S,
        value: +customerFromDb.voucher.M.value.N,
        type: customerFromDb.voucher.M.type.S,
      }
    : undefined,
  externalLinks: customerFromDb.externalLinks
    ? customerFromDb.externalLinks.L.map((externalLink) => externalLink.S)
    : undefined,
});

const mapAddress = (address) => {
  if (address.SK.S === "address_main") {
    return { ...mapCustomerAddress(address), id: "main" };
  }
  return mapSecondaryAddress(address);
};

const mapCustomerAddress = (customerAddressFromDb) => ({
  customerId: customerAddressFromDb.PK.S.replace("customer_", ""),
  city: customerAddressFromDb.city.S,
  postcode: customerAddressFromDb.postcode.S,
  number: customerAddressFromDb.number.S,
  street: customerAddressFromDb.street.S,
});

const mapSecondaryAddress = (secondaryAddress) => ({
  customerId: secondaryAddress.PK.S.replace("customer_", ""),
  id: secondaryAddress.SK.S.replace("address_secondary_", ""),
  street: secondaryAddress.street.S,
  number: secondaryAddress.number.S,
  city: secondaryAddress.city.S,
  postcode: secondaryAddress.postcode.S,
});

const mapJob = (jobFromDb) => {
  const start = dayjs(+jobFromDb.start.N);
  const end = dayjs(+jobFromDb.end.N);
  return {
    id: jobFromDb.PK.S.replace("job_", ""),
    name: jobFromDb.name.S,
    date: start.format("YYYY-MM-DD"),
    startTime: start.format("HH:mm"),
    endTime: end.format("HH:mm"),
    imageUrl: jobFromDb.image_url?.S,
  };
};

const mapJobTemporalFilters = (from, to) => {
  const fromNumeric = +new Date(from);
  const toNumeric = +new Date(to);
  return {
    from: fromNumeric,
    to: toNumeric,
  };
};

const mapJobFromRequestBody = (job) => ({
  ...job,
  start: +new Date(`${job.date} ${job.startTime}`),
  end: +new Date(`${job.date} ${job.endTime}`),
});

module.exports = {
  mapAddressIDsFromQuery,
  mapAddress,
  mapCustomer,
  mapCustomerAddress,
  mapSecondaryAddress,
  mapJob,
  mapJobFromRequestBody,
  mapJobTemporalFilters,
};
