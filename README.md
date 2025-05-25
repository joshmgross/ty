# ty
A Discord Bot to show some thanks


## Requirements

1. A Discord app with the permissions to send messages and use slash commands
    * See [configuration instructions from the Discord sample](https://discord.com/developers/applications)
1. A Cloudflare account for the Workers

## Configuration

Create a `.dev.vars` file with the following values

```yaml
DISCORD_APPLICATION_ID:
DISCORD_PUBLIC_KEY:
DISCORD_TOKEN:
```

Follow the instructions in https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
to generate an account ID and API token.

These should be set in an Actions environment matching the deploy workflow (`🛠️` if you're using this repo's deploy workflow.)
1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`

