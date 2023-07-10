/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    event.response.emailSubject = "Welcome to the example app";
    const email = event.request.usernameParameter;
    const password = event.request.codeParameter;
    event.response.emailMessage = createUserTemplate(email, password);
  }
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const email = event.request.userAttributes.email;
    const code = event.request.codeParameter;
    const redirectTo = event.request.clientMetadata.redirectTo;
    event.response.emailSubject = "Reset your password";
    event.response.emailMessage = forgotPasswordTemplate(
      email,
      code,
      redirectTo
    );
  }
  return event;
};

const createUserTemplate = (email, password) => `
<html style="margin: 0;padding: 0;font-family: &quot;Lucida Sans&quot;, &quot;Lucida Sans Regular&quot;, &quot;Lucida Grande&quot;,
          &quot;Lucida Sans Unicode&quot;, Geneva, Verdana, sans-serif;text-align: center;">
  <div class="header" style="width: 100%;background-color: #1b2a2f;border-bottom: 1px solid grey;padding: 30px;color: #f6f6f6;">Welcome to Example App</div>
  <div class="body" style="padding: 30px;">
    <h1 style="font-size: 1rem;font-weight: normal;width: 100%;">Your temporary credentials are:</h1>
    <table class="credentials" style="width: 400px;border-collapse: collapse;border: 1px solid #1b2a2f;margin: 0 auto;margin-top: 30px;">
      <tr>
        <td style="text-align: center;">Email</td>
      </tr>
      <tr>
        <td class="email" style="border-bottom: 1px solid #1b2a2f;font-family: &quot;Courier New&quot;, Courier, monospace;text-align: center;">${email}</td>
      </tr>
      <tr>
        <td style="text-align: center;">Temporary password</td>
      </tr>
      <tr>
        <td class="password" style="font-family: &quot;Courier New&quot;, Courier, monospace;text-align: center;">${password}</td>
      </tr>
    </table>
  </div>
</html>
`;

const forgotPasswordTemplate = (email, code, redirectTo) => `
<p>Click the follow link to reset your password</p>
<a href="${redirectTo}/reset-password?email=${email}&code=${code}" target="_blank">Click here</a>
`;
