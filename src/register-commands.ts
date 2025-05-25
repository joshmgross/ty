// This should only be run in development to register commands with Discord.
// node src/register-commands.ts

// Based on https://github.com/discord/cloudflare-sample-app/blob/ad13f7433d9c5d50d1a7ee1ce7b8bba00399ca86/src/register.js
import { TY_COMMAND } from './commands.ts';

import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config({path: '.dev.vars'});

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${token}`,
  },
  method: 'PUT',
  body: JSON.stringify([TY_COMMAND]),
});

if (response.ok) {
  console.log('Registered all commands');
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error('Error registering commands');
  let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
  try {
    const error = await response.text();
    if (error) {
      errorText = `${errorText} \n\n ${error}`;
    }
  } catch (err) {
    console.error('Error reading body from request:', err);
  }
  console.error(errorText);
}