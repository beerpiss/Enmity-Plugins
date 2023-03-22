import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";
import { get } from "enmity-api/rest";

const OsuPlugin: Plugin = {
  name: "Osu",
  commands: [],

  onStart() {
    const osu_command: Command = {
      id: "osu-command",
      applicationId: EnmitySectionID,

      name: "osu",
      displayName: "osu",

      description: "Gets information about an osu! player",
      displayDescription: "Gets information about an osu! player",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "username",
          displayName: "username",

          description: "Player to get information for",
          displayDescription: "Player to get information for",
          
          type: ApplicationCommandOptionType.String,
          required: true,
        }
      ],
    
      execute: async function (args, message) {
        const text = args[0].value;
        const channel = message.channel;
        const resp = await get(`https://api.obamabot.me/v1/text/osu?user=${text}`);
        if (resp.ok) {
          if (resp.body.length === 0) {
            sendReply(channel.id, `No osu! player found with the username ${text}`);
          }
          else {
            const reply = [
              `__${resp.body["username"]}'s stats__`,
              `Rank: #${resp.body["pp_rank"]} (#${resp.body["pp_country_rank"]} ${resp.body["country"]})`,
              `PP: ${resp.body["pp_raw"]}`,
              `Playcount: ${resp.body["playcount"]}`,
              `Accuracy: ${resp.body["short_accuracy"]}%`,
              `Playtime: ${resp.body["time_played"]}`,
              ``,
              `Profile URL: ${resp.body["user_profile"]}`
            ].join("\n")
            sendReply(channel.id, reply);
          }
        }
        else {
          sendReply(channel.id, `An error happened making a request to https://api.obamabot.ml/v1/text/osu?user=${text}`)
        }
      }
    }

    this.commands.push(osu_command);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(OsuPlugin);
