import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import { Construct } from "constructs";
import * as ses from "aws-cdk-lib/aws-ses";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    _amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    const senderEmailParam = new cdk.CfnParameter(this, "SenderEmail", {
      type: "String",
      description: "Sender email address to verify in SES",
    });
    const recipientEmailParam = new cdk.CfnParameter(this, "RecipientEmail", {
      type: "String",
      description: "First recipient email address to verify in SES",
    });

    const senderEmail: string = senderEmailParam.valueAsString;
    const recipientEmail: string = recipientEmailParam.valueAsString;

    new ses.CfnEmailIdentity(this, "SenderEmailIdentity", {
      emailIdentity: senderEmail,
    });
    new ses.CfnEmailIdentity(this, "RecipientEmailIdentity", {
      emailIdentity: recipientEmail,
    });
  }
}
