const AWS = require("aws-sdk");
const ses = new AWS.SES();

const emailCustomerAboutJob = async (customer, job) => {
  // should be customer.email, but we'll use this one for testing
  const destinationEmail = "pianeta14@hotmail.com";
  // should come from an env var, but let's hardcode it for now
  const senderEmail = "pianeta05@hotmail.com";

  const subject = "New job created";
  const textBody = emailCustomerAboutJobTextTemplate(customer, job);
  const htmlBody = emailCustomerAboutJobHtmlTemplate(customer, job);

  const params = {
    Source: senderEmail,
    Destination: {
      ToAddresses: [destinationEmail],
    },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: textBody, Charset: "UTF-8" },
        Html: { Data: htmlBody, Charset: "UTF-8" },
      },
    },
  };
  await ses.sendEmail(params).promise();
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
