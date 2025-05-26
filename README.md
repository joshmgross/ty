# ty
A Discord Bot to show some thanks


## Requirements

1. A Cloudflare account for the Workers
1. A Discord app with the permissions to send messages and use slash commands
    * See [configuration instructions from the Discord sample](https://discord.com/developers/applications)
    * The "Interactions Endpoint URL" under "General Information" should be set to your CF Workers URL

## Configuration

### Cloudflare

Run `npm run deploy` and then follow the instructions to auth with your Cloudflare account.

This will fail after auth until you configure [Hyperdrive](#cloudflare-hyperdrive), continue following
these instructions.

Follow the instructions in https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
to generate an account ID and API token.

These should be set in an Actions environment matching the deploy workflow (`🛠️` if you're using this repo's deploy workflow.)
1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`

### Discord
Create a `.dev.vars` file with the following values

```yaml
DISCORD_APPLICATION_ID:
DISCORD_PUBLIC_KEY:
DISCORD_TOKEN:
```

These should also be set in your Cloudflare project:

```shell
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_TOKEN
```

### PlanetScale

Create a PlanetScale database using your preferred method of choice.

https://planetscale.com/docs/tutorials/planetscale-quick-start-guide

### Cloudflare Hyperdrive

[Docs](https://developers.cloudflare.com/hyperdrive/examples/connect-to-mysql/mysql-database-providers/planetscale/)

Create a `read/write` password in Planetscale for your database and save the connection URL in `.dev.vars`


```yaml
DATABASE_URL=
```

Then, set up Hyperdrive with `wrangler`:

```
npx wrangler hyperdrive create tydb --connection-string="<DATABASE_URL>"
```

Save the resulting Hyperdrive binding id as `CLOUDFLARE_HYPERDRIVE_ID` in your `.dev.vars` and in your Actions
environment.

Run `script/setup-wrangler` to create the `wrangler.jsonc` file with this secret.

Now deploy your worker with `npm run deploy`.
