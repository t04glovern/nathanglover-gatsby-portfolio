import cdk = require('@aws-cdk/core');
import codebuild = require("@aws-cdk/aws-codebuild");
import ssm = require('@aws-cdk/aws-ssm');
import iam = require("@aws-cdk/aws-iam");

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CloudWatch Log Read/Write Access
    const log_policy = new iam.PolicyStatement({
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: [
        `arn:aws:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:/aws/codebuild/*`,
      ]
    });

    // CloudFront Invalidation Access
    const cloudfront_policy = new iam.PolicyStatement({
      actions: [
        "cloudfront:CreateInvalidation",
      ],
      resources: [
        `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/*`
      ]
    });

    const s3_policy = new iam.PolicyStatement({
      actions: [
        "s3:*",
      ],
      resources: [
        "arn:aws:s3:::nathanglover.com/*"
      ]
    });

    const contentful_space_id_param = ssm.StringParameter.fromSecureStringParameterAttributes(this, "param-contentful-space-id", {
      parameterName: "/CodeBuild/nathanglover.com/contentful_space_id",
      version: 1
    });

    const contentful_access_token_param = ssm.StringParameter.fromSecureStringParameterAttributes(this, "param-contentful-access-token", {
      parameterName: "/CodeBuild/nathanglover.com/contentful_access_token",
      version: 1
    });

    const google_analytics_id_param = ssm.StringParameter.fromSecureStringParameterAttributes(this, "param-google-analytics-id", {
      parameterName: "/CodeBuild/nathanglover.com/google_analytics_id",
      version: 1
    });

    //
    // Source - (GitHub_Source)
    //
    const gitHubSource = codebuild.Source.gitHub({
      owner: "t04glovern",
      repo: "nathanglover-gatsby-portfolio",
      reportBuildStatus: true,
      webhook: true,
    });

    //
    // CodeBuild - Build
    //
    const buildProject = new codebuild.Project(this, "nathanglover-gatsby-portfolio-build", {
      projectName: "nathanglover-gatsby-portfolio-build",
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.yml"),
      source: gitHubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
        environmentVariables: {
          CONTENTFUL_SPACE_ID: {
            type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
            value: contentful_space_id_param
          },
          CONTENTFUL_ACCESS_TOKEN: {
            type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
            value: contentful_access_token_param
          },
          GOOGLE_ANALYTICS_ID: {
            type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
            value: google_analytics_id_param
          },
          CLOUDFRONT_DIST_ID: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: "E1H0DY0P2SKEYR"
          },
          S3_BUCKET: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: "nathanglover.com"
          }
        }
      },
    });
    buildProject.addToRolePolicy(log_policy);
    buildProject.addToRolePolicy(cloudfront_policy);
    buildProject.addToRolePolicy(s3_policy);
  }
}
