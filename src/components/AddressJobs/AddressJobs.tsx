import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { UpcomingAddressJobs } from "../UpcomingAddressJobs/UpcomingAddressJobs";
import { PastAddressJobs } from "../PastAddressJobs/PastAddressJobs";

type AddressJobsProps = {
  addressId: string;
  customerId: string;
};

export const AddressJobs: FC<AddressJobsProps> = ({
  addressId,
  customerId,
}) => {
  const [selectedTab, setSelectedTab] = useState("upComing");
  const changeTabHandler = (_event: React.SyntheticEvent, value: string) => {
    setSelectedTab(value);
  };

  // -----

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <Link to={`/jobs/create?addressId=${addressId}&customerId=${customerId}`}>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Add new
        </Button>
      </Link>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedTab} onChange={changeTabHandler}>
          <Tab label="Upcoming" value="upComing" />
          <Tab label="Past" value="past" />
        </Tabs>
      </Box>
      {selectedTab === "upComing" ? (
        <UpcomingAddressJobs addressId={addressId} customerId={customerId} />
      ) : (
        <PastAddressJobs addressId={addressId} customerId={customerId} />
      )}
    </>
  );
};
