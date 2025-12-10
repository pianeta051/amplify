/* Amplify Params - DO NOT EDIT
	AUTH_EXERCISESAUTH_USERPOOLID
	ENV
	REGION
	STORAGE_EXERCISES_ARN
	STORAGE_EXERCISES_NAME
	STORAGE_EXERCISES_STREAMARN
Amplify Params - DO NOT EDIT */

const { emailUserTimetable } = require("./mailer");
const { getUser } = require("./users");
const { getNextWeekJobs } = require("./jobs");

const USER_ID = "36f242a4-1091-70d3-eaa0-d624c792ec48";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async () => {
  const user = await getUser(USER_ID);
  const name = user.name ?? user.email.split("@")[0];
  user.name = name;
  const jobs = await getNextWeekJobs(USER_ID);
  if (jobs.length > 0) {
    await emailUserTimetable(user, jobs);
  }

  return {
    statusCode: 200,
    body: { jobs },
  };
};
