# Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Create Secrets

```bash
aws ssm put-parameter \
    --name "/CodeBuild/nathanglover.com/contentful_space_id" \
    --type "String" \
    --value "xxxxxxxxxxxxx"

aws ssm put-parameter \
    --name "/CodeBuild/nathanglover.com/contentful_access_token" \
    --type "String" \
    --value "xxxxxxxxxxxxx"

aws ssm put-parameter \
    --name "/CodeBuild/nathanglover.com/google_analytics_id" \
    --type "String" \
    --value "xxxxxxxxxxxxx"
```
