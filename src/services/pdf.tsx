import { JobFormValues } from "../components/JobForm/JobForm";
import ReactPDF from "@react-pdf/renderer";
import { JobInvoice } from "../components/JobInvoice/JobInvoice";
import { uploadFile } from "./files";
import { CustomerAddress } from "./customers";

export const generateJobInvoice = async (
  formValues: JobFormValues,
  addresses: CustomerAddress[],
  s3Key: string
) => {
  const pdfStream = await ReactPDF.pdf(
    <JobInvoice job={formValues} addresses={addresses} />
  ).toBlob();
  await uploadFile(new File([pdfStream], "invoice.pdf"), s3Key);
};
