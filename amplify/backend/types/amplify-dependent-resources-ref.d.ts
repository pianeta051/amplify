export type AmplifyDependentResourcesAttributes = {
  auth: {
    exercises: {
      IdentityPoolId: "string";
      IdentityPoolName: "string";
      UserPoolId: "string";
      UserPoolArn: "string";
      UserPoolName: "string";
      AppClientIDWeb: "string";
      AppClientID: "string";
    };
    userPoolGroups: {
      AdminGroupRole: "string";
    };
  };
  function: {
    exercisesCustomMessage: {
      Name: "string";
      Arn: "string";
      LambdaExecutionRole: "string";
      Region: "string";
    };
    AdminQueries2f011aff: {
      Name: "string";
      Arn: "string";
      Region: "string";
      LambdaExecutionRole: "string";
    };
  };
  api: {
    AdminQueries: {
      RootUrl: "string";
      ApiName: "string";
      ApiId: "string";
    };
  };
};
