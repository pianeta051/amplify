import { FC, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import {
  Button,
  CircularProgress,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CustomerTaxData } from "../../components/CustomerTaxData/CustomerTaxData";
import { CustomerVoucher } from "../../components/CustomerVoucher/CustomerVoucher";
import { CustomerInformation } from "../../components/CustomerInformation/CustomerInformation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useCustomer } from "../../hooks/useCustomer/useCustomer";
import { CustomerExternalLinks } from "../../components/CustomerExternalLinks/CustomerExternalLinks";
import { CustomerAddresses } from "../../components/CustomerAddresses/CustomerAddresses";

type CustomerDetailsParams = {
  customerId: string;
};

const tabNames = [
  "information",
  "taxData",
  "voucher",
  "externalLinks",
  "addresses",
] as const;
type TabName = typeof tabNames[number];
const tabLabels: Record<TabName, string> = {
  information: "Information",
  taxData: "Tax data",
  voucher: "Voucher details",
  externalLinks: "External links",
  addresses: "Addresses",
};

type CustomerSectionTabProps = {
  value: TabName;
  children: React.ReactNode;
};

const CustomerSectionTab: FC<CustomerSectionTabProps> = ({
  value,
  children,
}) => {
  return (
    <>
      <TabPanel value={value}>{children}</TabPanel>
    </>
  );
};
export const CustomerDetailsPage: FC = () => {
  const { customerId } = useParams<CustomerDetailsParams>();
  const { customer, error, loading } = useCustomer(customerId);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const addTaxDataHandler = () =>
    navigate(`/customers/${customerId}/tax-data/add`);
  const addVoucherHandler = () =>
    navigate(`/customers/${customerId}/voucher-detail/add`);
  const queryParams = searchParams.get("tab") || "";
  let initialValue: TabName = "information";
  if (tabNames.includes(queryParams as TabName)) {
    initialValue = queryParams as TabName;
  }
  const [currentTab, setCurrentTab] = useState<TabName>(initialValue);

  const changeTabHandler = (_: React.SyntheticEvent, newValue: TabName) => {
    setSearchParams({ tab: newValue });
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Customer details page
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error) {
    return <ErrorAlert code={error} />;
  }
  if (!customerId) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }
  if (!customer) {
    return <ErrorAlert code="INTERNAL_ERROR" />;
  }

  return (
    <>
      <TabContext value={currentTab}>
        <Stack direction="row" spacing={2}>
          <TabList orientation="vertical" onChange={changeTabHandler}>
            {tabNames.map((tabName) => (
              <Tab label={tabLabels[tabName]} value={tabName} key={tabName} />
            ))}
          </TabList>
          <CustomerSectionTab value="information">
            {customer && <CustomerInformation customer={customer} />}
          </CustomerSectionTab>
          <CustomerSectionTab value="taxData">
            {customer.taxData ? (
              <CustomerTaxData
                taxData={customer.taxData}
                customerId={customer.id}
              />
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTaxDataHandler}
              >
                Add tax data
              </Button>
            )}
          </CustomerSectionTab>
          <CustomerSectionTab value="voucher">
            {customer.voucher ? (
              <CustomerVoucher
                voucher={customer.voucher}
                customerId={customer.id}
              />
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addVoucherHandler}
              >
                Add Voucher
              </Button>
            )}
          </CustomerSectionTab>
          <CustomerSectionTab value="externalLinks">
            <CustomerExternalLinks
              links={customer.externalLinks ?? []}
              customerId={customer.id}
            />
          </CustomerSectionTab>
          <CustomerSectionTab value="addresses">
            <CustomerAddresses customerId={customer.id} />
          </CustomerSectionTab>
        </Stack>
      </TabContext>
    </>
  );
};
