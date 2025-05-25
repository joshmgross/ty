// https://discord.com/developers/docs/interactions/application-commands

export const TY_COMMAND = {
  name: 'ty',
  description: 'Send some thanks!',
  options: [
    {
      name: 'person',
      description: 'The person to thank',
      required: true,
      type: 6 // USER type
    },
    {
      name: 'message',
      description: 'The thank you message',
      required: true,
      type: 3 // STRING type
    }
  ]
};
