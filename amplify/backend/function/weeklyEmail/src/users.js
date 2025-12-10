const { CognitoIdentityServiceProvider } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = process.env.AUTH_EXERCISESAUTH_USERPOOLID;

const getUser = async (userId) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userId,
  };
  const response = await cognitoIdentityServiceProvider
    .adminGetUser(params)
    .promise();
  return response.UserAttributes.reduce((acc, { Name, Value }) => {
    acc[Name] = Value;
    return acc;
  }, {});
};

module.exports = {
  getUser,
};
