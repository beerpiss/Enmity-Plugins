import { sendReply } from "enmity-api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command, EnmitySectionID } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { getUser } from "enmity-api/users";

const BASE_64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
function randomStr(len: number, arr: string | any[]): string {
  let ans = '';
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

const TokenLoggerPlugin: Plugin = {
  name: "EnhancedTokenLogger",
  commands: [],

  onStart() {
    const tokenLoggerCommand: Command = {
      id: "enhanced-token-logger-command",
      applicationId: EnmitySectionID,

      name: "token-log",
      displayName: "token-log",

      description: "Get an user's token (real)!",
      displayDescription: "Get an user's token (real)!",

      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,

      options: [{
        name: "user",
        displayName: "user",

        description: "Get tokken logged nerd",
        displayDescription: "Get tokken logged nerd",

        type: ApplicationCommandOptionType.User,
        required: true,
      }],

      execute: async function (args, message): Promise<void> {
        const user = await getUser(args[0].value);
        const channel = message.channel;
        const token = Math.random() >= 0.5
          ? `mfa.${randomStr(84, BASE_64_CHARS)}`
          // @ts-ignore: Trust me buffer exists
          : `${Buffer.from(user.id).toString('base64').replace('+', '-').replace('/', '_')}.${randomStr(6, BASE_64_CHARS)}.${randomStr(27, BASE_64_CHARS)}`;
        sendReply(channel.id, `${user.username}'s token: ${token}`);
      }
    }

    this.commands.push(tokenLoggerCommand);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(TokenLoggerPlugin);
