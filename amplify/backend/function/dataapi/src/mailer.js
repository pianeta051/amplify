const AWS = require("aws-sdk");
const ses = new AWS.SES();
const s3Client = new AWS.S3();

const emailCustomerAboutJob = async (customer, job) => {
  // should be customer.email, but we'll use this one for testing
  const destinationEmail = "pianeta14@hotmail.com";
  // should come from an env var, but let's hardcode it for now
  const senderEmail = "pianeta05@hotmail.com";

  const textBody = emailCustomerAboutJobTextTemplate(customer, job);
  const htmlBody = emailCustomerAboutJobHtmlTemplate(customer, job);

  const rawEmailParams = {
    from: senderEmail,
    to: destinationEmail,
    textContent: textBody,
    htmlContent: htmlBody,
  };

  if (job.invoiceKey) {
    const s3Response = await s3Client
      .getObject({
        Bucket: process.env.STORAGE_S33CA9C572_BUCKETNAME,
        Key: `public/${job.invoiceKey}`,
      })
      .promise();
    const fileBuffer = s3Response.Body;
    const base64File = fileBuffer.toString("base64");
    rawEmailParams.attachmentFileContent = base64File;
  }
  const params = {
    Source: senderEmail,
    Destinations: [destinationEmail],
    RawMessage: {
      Data: emailCustomerAboutJobRawEmail(rawEmailParams),
    },
  };

  await ses.sendRawEmail(params).promise();
};

const mixedBoundary = "MixedBoundary123";
const alternativeBoundary = "AltBoundary456";

const emailCustomerAboutJobRawEmail = ({
  from,
  to,
  textContent,
  htmlContent,
  attachmentFileContent,
}) => {
  const rawEmail =
    `From: ${from}\n` +
    `To: ${to}\n` +
    `Subject: New job created\n` +
    `MIME-Version: 1.0\n` +
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"\n\n` +
    // --- multipart/alternative (text + html)
    `--${mixedBoundary}\n` +
    `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"\n\n` +
    `--${alternativeBoundary}\n` +
    `Content-Type: text/plain; charset="utf-8"\n\n` +
    `${textContent}\n\n` +
    // HTML
    `--${alternativeBoundary}\n` +
    `Content-Type: text/html; charset="utf-8"\n\n` +
    `${htmlContent}\n\n` +
    `--${alternativeBoundary}--\n\n` +
    // --- Attachment
    `--${mixedBoundary}\n` +
    `Content-Type: application/pdf; name="invoice.pdf"\n` +
    `Content-Disposition: attachment; filename="invoice.pdf"\n` +
    `Content-Transfer-Encoding: base64\n\n` +
    attachmentFileContent +
    `\n\n--${mixedBoundary}--`;
  return rawEmail;
};

const emailCustomerAboutJobTextTemplate = (customer, job) => `
Hi ${customer && customer.name ? customer.name : "there"},


A new job has just been created for you.


- Job: ${job && job.name ? job.name : "N/A"}
- Date: ${job && job.date ? job.date : "TBD"}
- Time: ${job && job.startTime ? job.startTime : "--:--"} - ${
  job && job.endTime ? job.endTime : "--:--"
}
- Price: ${
  job && job.price !== undefined && job.price !== null
    ? `€${Number(job.price).toFixed(2)}`
    : "TBD"
}


If you have any questions, simply reply to this email.


Thanks,
Carlos
`;

const emailCustomerAboutJobHtmlTemplate = (customer, job) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #111;">
 <h2 style="margin: 0 0 12px; font-size: 18px;">Hi ${
   customer && customer.name ? customer.name : "there"
 },</h2>
 <p style="margin: 0 0 14px;">A new job has just been created for you.</p>
 <table style="border-collapse: collapse; width: 100%; max-width: 520px;">
   <tbody>
     <tr>
       <td style="padding: 6px 0; width: 120px; color: #555;">Job</td>
       <td style="padding: 6px 0;"><strong>${
         job && job.name ? job.name : "N/A"
       }</strong></td>
     </tr>
     <tr>
       <td style="padding: 6px 0; color: #555;">Date</td>
       <td style="padding: 6px 0;">${job && job.date ? job.date : "TBD"}</td>
     </tr>
     <tr>
       <td style="padding: 6px 0; color: #555;">Time</td>
       <td style="padding: 6px 0;">${
         job && job.startTime ? job.startTime : "--:--"
       } - ${job && job.endTime ? job.endTime : "--:--"}</td>
     </tr>
     <tr>
       <td style="padding: 6px 0; color: #555;">Price</td>
       <td style="padding: 6px 0;">${
         job && job.price !== undefined && job.price !== null
           ? `€${Number(job.price).toFixed(2)}`
           : "TBD"
       }</td>
     </tr>
   </tbody>
 </table>
 <p style="margin: 16px 0 0;">If you have any questions, simply reply to this email.</p>
 <p style="margin: 8px 0 0;">Thanks,<br/>Carlos</p>
</div>
`;

module.exports = {
  emailCustomerAboutJob,
};
