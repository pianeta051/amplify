const { CognitoIdentityServiceProvider } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = "eu-west-2_Pyr00gWzU";

const getGroups = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };
  const result = await cognitoIdentityServiceProvider
    .adminListGroupsForUser(params)
    .promise();
  if (result) {
    return result.Groups?.map((g) => g.GroupName);
  }
  return [];
};

const getAuthData = async (req) => {
  const authProvider =
    req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider;
  const providerParts = authProvider.split(":");
  const userSub = providerParts[providerParts.length - 1];
  const groups = await getGroups(userSub);
  return {
    userSub,
    groups,
  };
};

const USER_ATTRIBUTES = ["sub", "name", "email"];
const getUserInfo = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };
  const response = await cognitoIdentityServiceProvider
    .adminGetUser(params)
    .promise();
  return response.UserAttributes.reduce((acc, { Name, Value }) => {
    if (USER_ATTRIBUTES.includes(Name)) {
      acc[Name] = Value;
    }
    return acc;
  }, {});
};

module.exports = {
  getAuthData,
  getUserInfo,
};
