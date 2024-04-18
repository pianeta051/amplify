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

const mapCustomerAddress = (customerAddressFromDb) => ({
  city: customerAddressFromDb.city.S,
  postcode: customerAddressFromDb.postcode.S,
  number: customerAddressFromDb.number.S,
  street: customerAddressFromDb.street.S,
});

const mapSecondaryAddress = (secondaryAddress) => ({
  id: secondaryAddress.SK.S.replace("address_secondary_", ""),
  street: secondaryAddress.street.S,
  number: secondaryAddress.number.S,
  city: secondaryAddress.city.S,
  postcode: secondaryAddress.postcode.S,
});

module.exports = {
  mapCustomer,
  mapCustomerAddress,
  mapSecondaryAddress,
};
