import { sendReply } from "enmity-api/clyde";
import {
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Command,
  EnmitySectionID,
} from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { Image } from "enmity-api/react";
import { get } from "enmity-api/rest";

const nekos_life_img_types = [
  "tickle",
  "slap",
  "poke",
  "pat",
  "neko",
  "meow",
  "lizard",
  "kiss",
  "hug",
  "fox_girl",
  "feed",
  "cuddle",
  "ngif",
  "kemonomimi",
  "holo",
  "smug",
  "baka",
  "woof",
  "wallpaper",
  "goose",
  "gecg",
  "avatar",
  "waifu",
];

async function getImageSize(file: string): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      Image.getSize(file, (width: number, height: number) => {
        resolve({ width, height });
      }, (error) => {
        reject(error);
      });
    },
  );
}

const CatgirlsPlugin: Plugin = {
  name: "Catgirls",
  commands: [],

  onStart() {
    const catgirls_command: Command = {
      id: "catgirls-command",
      applicationId: EnmitySectionID,

      name: "nekos",
      displayName: "nekos",

      description: "Sends an image from the nekos.life API.",
      displayDescription: "Sends an image from the nekos.life API.",

      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,

      options: [
        {
          name: "type",
          displayName: "type",

          description: "Image type",
          displayDescription: "Image type",

          type: ApplicationCommandOptionType.String,
          required: true,
          choices: nekos_life_img_types.map((x) => ({
            name: x,
            displayName: x,
            value: x,
          })),
        },
        {
          name: "whisper",
          displayName: "whisper",

          description: "Whisper the URL instead of sending it to chat",
          displayDescription: "Whisper the URL instead of sending it to chat",

          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],

      execute: async function (args, message) {
        const text = args[0].value;
        const whisper = args[1]?.value ?? true;
        const resp = await get(`https://nekos.life/api/v2/img/${text}`);
        if (resp.ok) {
          if (whisper) {
            const { width, height } = await getImageSize(resp.body["url"]);
            const embed = {
              type: "rich",
              title: `random ${text} image`,
              image: {
                proxy_url: `https://external-content.duckduckgo.com/iu/?u=${
                  resp.body["url"]
                }`,
                url: resp.body["url"],
                width: width,
                height: height,
              },
              footer: {
                text: "nekos.life",
              },
              color: "0x45f5f5",
            };
            const component = {
              type: 1,
              components: [{
                type: 2,
                style: 5,
                label: "View image",
                url: resp.body["url"],
              }],
            };
            sendReply(
              message.channel.id,
              {
                embeds: [embed],
                components: [component],
              },
              "nekos.life",
              "https://github.com/Nekos-life.png",
            );
          } else {
            return {
              content: resp.body["url"],
            };
          }
        } else {
          const channel = message.channel;
          sendReply(
            channel.id,
            `An error happened making a request to https://nekos.life/api/v2/img/${text}`,
          );
        }
      },
    };

    this.commands.push(catgirls_command);
  },

  onStop() {
    this.commands = [];
  },
};

registerPlugin(CatgirlsPlugin);
