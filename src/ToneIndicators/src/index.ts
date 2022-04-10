import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";
import { tones } from "./tones";

const ToneIndicators: Plugin = {
  name: "ToneIndicators",
  commands: [],

  onStart() {
    const tone_indicators: Command = {
      id: "tone-indicators-command",
      applicationId: EnmitySectionID,

      name: "tone",
      displayName: "tone",

      description: "Tells you what a tone indicator means",
      displayDescription: "Tells you what a tone indicator means.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "tone",
          displayName: "tone",

          description: "Tone indicator",
          displayDescription: "Tone indicators",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
      ],
    
      execute: async function (args, message): Promise<void> {
        const rawtone = args[0].value;
        const tone = rawtone.replace("/", "");
        const channel = message.channel;
        const tone_description = tones[tone] ?? "I don't know about that tone! Feel free to make a PR at https://github.com/beerpiss/enmity or yell at beerpsi#5270";
        sendReply(channel.id, `${tone}: ${tone_description}`)
      }
    }

    this.commands.push(tone_indicators);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(ToneIndicators);
