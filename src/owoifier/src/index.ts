import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import owoify from "owoify-js";

const OwO: Plugin = {
  name: "owoifier",
  commands: [],

  onStart() {
    const UwU: Command = {
      id: "owoifier-command",
      applicationId: EnmitySectionID,

      name: "owoify",
      displayName: "owoify",

      description: "hewwowo ^w^ i am ywouw wowowst nyightmawe",
      displayDescription: "hewwowo ^w^ i am ywouw wowowst nyightmawe",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "text twowo send",
          displayDescription: "text twowo send",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "level",
          displayName: "level",

          description: "teh wewew twowo cuwse ywowouw text wif",
          displayDescription: "teh wewew twowo cuwse ywowouw text wif",

          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            {
              name: "owo",
              displayName: "owo",
              value: "owo"
            },
            {
              name: "uwu",
              displayName: "uwu",
              value: "uwu"
            },
            {
              name: "uvu",
              displayName: "uvu",
              value: "uvu"
            }
          ]
        }
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
        const level = args[1]?.value ?? "owo";
    
        return {
          content: owoify(text, level)
            .replaceAll("_", "\\_")
            .replaceAll("`", "\\`")
            .replaceAll("*", "\\*")
            .replaceAll("~", "\\~")
            .replaceAll("#", "\\#")
            .replaceAll("(", "\\(")
            .replaceAll(")", "\\)")
            .replaceAll("[", "\\[")
            .replaceAll("]", "\\]")
            .replaceAll("-", "\\-")
            .replaceAll("<", "\\<")
            .replaceAll(">", "\\>")
            .replaceAll("|", "\\|")
        };
      }
    }

    this.commands.push(UwU);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(OwO);
