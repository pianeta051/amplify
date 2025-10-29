import { FC } from "react";
import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import { CustomerAddress } from "../../services/customers";
import { JobFormValues } from "../JobForm/JobForm";
import { transformFormValues } from "../../services/jobs";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
});

type JobInvoiceProps = {
  job: JobFormValues;
  addresses: CustomerAddress[];
  taxRate?: number;
  discount?: number;
};

export const JobInvoice: FC<JobInvoiceProps> = ({
  job,
  addresses,
  taxRate = 21,
  discount = 0,
}) => {
  const transformedJob = transformFormValues(job);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle title={job.name} />
        <InvoiceDate
          date={transformedJob.date}
          timeTo={transformedJob.endTime}
          timeFrom={transformedJob.startTime}
        />
        <BillTo addresses={addresses} />
        <InvoiceTable price={job.price} taxRate={taxRate} discount={discount} />
      </Page>
    </Document>
  );
};

const titleStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  reportTitle: {
    color: "#61dafb",
    letterSpacing: 4,
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

type InvoiceTitleProps = {
  title: string;
};

const InvoiceTitle: FC<InvoiceTitleProps> = ({ title }) => (
  <View style={titleStyles.titleContainer}>
    <Text style={titleStyles.reportTitle}>{title}</Text>
  </View>
);

const dateStyles = StyleSheet.create({
  invoiceDateContainer: {
    marginTop: 36,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceTimeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontWeight: "bold",
  },
  label: {
    width: 60,
  },
});

type InvoiceDateProps = {
  date: string;
  timeFrom: string;
  timeTo: string;
};

const InvoiceDate: FC<InvoiceDateProps> = ({ date, timeFrom, timeTo }) => (
  <>
    <View style={dateStyles.invoiceDateContainer}>
      <Text style={dateStyles.label}>Date: </Text>
      <Text>{date}</Text>
    </View>
    <View style={dateStyles.invoiceTimeContainer}>
      <Text style={dateStyles.label}>Time: </Text>
      <Text>
        From {timeFrom} to {timeTo}
      </Text>
    </View>
  </>
);

const billToStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  addressContainer: {
    marginTop: 10,
  },
});

type BillToProps = {
  addresses: CustomerAddress[];
};

const BillTo: FC<BillToProps> = ({ addresses }) => (
  <View style={billToStyles.headerContainer}>
    <Text style={billToStyles.billTo}>Bill To:</Text>
    {addresses.map((address) => (
      <View key={address.number} style={billToStyles.addressContainer}>
        <Text>
          {address.street} {address.number}
        </Text>
        <Text>{address.city}</Text>
        <Text>{address.postcode}</Text>
      </View>
    ))}
  </View>
);

const tableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
  headerContainer: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontWeight: "bold",
    flexGrow: 1,
  },
  header: {
    width: "20%",
    borderRightColor: "#90e5fc",
    borderRightWidth: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
  },
  cell: {
    width: "20%",
    textAlign: "left",
    borderRightColor: "#90e5fc",
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  totalPrice: {
    width: "20%",
    textAlign: "left",
    borderRightColor: "#90e5fc",
    borderRightWidth: 1,
    paddingLeft: 8,
    fontWeight: "bold",
  },
});

type InvoiceTableProps = {
  price: number;
  taxRate: number;
  discount: number;
};

const InvoiceTable: FC<InvoiceTableProps> = ({ price, taxRate, discount }) => (
  <View style={tableStyles.tableContainer}>
    <View style={tableStyles.headerContainer}>
      <Text style={tableStyles.header}>Price</Text>
      <Text style={tableStyles.header}>Tax rate</Text>
      <Text style={tableStyles.header}>Tax amount</Text>
      <Text style={tableStyles.header}>Discount</Text>
      <Text style={tableStyles.header}>Total price</Text>
    </View>
    <View style={tableStyles.row}>
      <Text style={tableStyles.cell}>£ {price.toFixed(2)}</Text>
      <Text style={tableStyles.cell}>{taxRate}%</Text>
      <Text style={tableStyles.cell}>
        £ {((price * taxRate) / 100).toFixed(2)}
      </Text>
      <Text style={tableStyles.cell}>£ {discount.toFixed(2)}</Text>
      <Text style={tableStyles.totalPrice}>
        £ {(price + (price * taxRate) / 100 - discount).toFixed(2)}
      </Text>
    </View>
  </View>
);
