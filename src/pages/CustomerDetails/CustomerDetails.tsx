import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { CustomerMainAddress } from "../../components/CustomerMainAddress/CustomerMainAddress";
import { useCustomer } from "../../hooks/useCustomer";

type CustomerDetailsParams = {
  id: string;
};

const tabNames = ["information", "taxData", "voucher", "mainAddress"] as const;
type TabName = typeof tabNames[number];
const tabLabels: Record<TabName, string> = {
  information: "Information",
  taxData: "Tax data",
  voucher: "Voucher details",
  mainAddress: "Main Address",
};

type CustomerSectionTabProps = {
  value: TabName;
  children: React.ReactNode;
};

const CustomerSectionTab: FC<CustomerSectionTabProps> = ({
  value,
  children,
}) => {
  return <TabPanel value={value}>{children}</TabPanel>;
};

export const CustomerDetailsPage: FC = () => {
  const [currentTab, setCurrentTab] = useState<TabName>("information");
  const { id } = useParams<CustomerDetailsParams>();
  const { customer, error, loading } = useCustomer(id);

  const navigate = useNavigate();

  const addTaxDataHandler = () => navigate(`/customers/${id}/tax-data/add`);
  const addVoucherHandler = () =>
    navigate(`/customers/${id}/voucher-detail/add`);

  const deleteVoucherHandler = () => {
    // setCustomer((customer) => {
    //   if (customer) {
    //     return {
    //       ...customer,
    //       voucher: undefined,
    //     };
    //   }
    //   return null;
    // });
  };

  const changeTabHandler = (_: React.SyntheticEvent, newValue: TabName) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    <>
      <Typography variant="h3" gutterBottom>
        Customer details page
      </Typography>
      <CircularProgress />
    </>;
  }
  if (error) {
    return <ErrorAlert code={error} />;
  }
  if (!id) {
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
                onDelete={deleteVoucherHandler}
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
          <CustomerSectionTab value="mainAddress">
            <CustomerMainAddress customerId={customer.id} />
          </CustomerSectionTab>
        </Stack>
      </TabContext>
    </>
  );
};
