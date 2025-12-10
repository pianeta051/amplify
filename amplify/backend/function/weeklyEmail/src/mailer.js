const AWS = require("aws-sdk");
const ses = new AWS.SES();

const groupJobsByDate = (jobs) => {
  const groupedByDate = jobs.reduce((acc, job) => {
    acc[job.date] = [...(acc[job.date] || []), job];
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    compareDateValues(a, b)
  );
  const result = sortedDates.map((date) => {
    const sortedJobsForDate = groupedByDate[date]
      .slice()
      .sort((a, b) => a.start - b.start);
    return { date, jobs: sortedJobsForDate };
  });
  return result;
};

const compareDateValues = (a, b) => {
  const weekdayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  return weekdayOrder[a] - weekdayOrder[b];
};

const emailUserTimetable = async (user, jobs) => {
  // should be the user's email, but we'll use this one for testing
  const destinationEmail = "pianeta05@hotmail.com";
  // should come from an env var, but let's hardcode it for now
  const senderEmail = "pianeta14@hotmail.com";

  const subject = "Your weekly timetable";
  const groupedJobs = groupJobsByDate(jobs);
  const textBody = emailUserTimetableTextTemplate(user, groupedJobs);
  const htmlBody = emailUserTimetableHtmlTemplate(user, groupedJobs);

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

const emailUserTimetableTextTemplate = (user, jobs) => `Hello ${user.name},
Here is your weekly timetable:
${jobs
  .map(({ date, jobs: jobsForDate }) => {
    return `
${date}
${jobsForDate
  .map((job) => `- ${job.name} ${job.startTime} - ${job.endTime}`)
  .join("\n")}`;
  })
  .join("\n")}
`;

const emailUserTimetableHtmlTemplate = (user, jobs) => `
<div style="margin:0; padding:24px; background:#f5f7fb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height:1.6; color:#111827;">
 <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(16,24,40,0.08);">
   <div style="background:#4f46e5; padding:20px 24px;">
     <h2 style="margin:0; font-size:18px; color:#ffffff; font-weight:600;">Your weekly timetable</h2>
     <p style="margin:8px 0 0; font-size:14px; color:#e0e7ff;">Hello ${
       user.name
     }, here's your schedule for the week.</p>
   </div>
   <div style="padding:20px 24px;">
     ${jobs
       .map(({ date, jobs: jobsForDate }) => {
         return `
       <div style="margin:16px 0 20px; border:1px solid #e5e7eb; border-radius:10px;">
         <div style="padding:12px 14px; background:#f9fafb; border-bottom:1px solid #e5e7eb;">
           <div style="font-weight:700; font-size:14px; color:#111827;">${date}</div>
         </div>
         <ul style="list-style:none; padding:8px 14px 6px; margin:0;">
           ${jobsForDate
             .map(
               (job) => `
             <li style="display:flex; align-items:center; justify-content:flex-start; gap:10px; padding:10px 4px; border-bottom:1px dashed #e5e7eb;">
               <span style="font-size:12px; color:#1f2937; background:#eef2ff; border:1px solid #c7d2fe; padding:4px 8px; border-radius:999px;">${job.startTime} - ${job.endTime}</span>
               <span style="font-size:14px; color:#111827; font-weight:500;">${job.name}</span>
             </li>`
             )
             .join("")}
         </ul>
       </div>`;
       })
       .join("")}
     <p style="margin:8px 0 0; font-size:12px; color:#6b7280;">Times are shown in your local timezone.</p>
   </div>
   <div style="padding:16px 24px; border-top:1px solid #e5e7eb; background:#fafafa;">
     <p style="margin:0; font-size:12px; color:#6b7280;">Need a change? Reply to this email and we’ll help.</p>
   </div>
 </div>
</div>
`;

module.exports = {
  emailUserTimetable,
};
